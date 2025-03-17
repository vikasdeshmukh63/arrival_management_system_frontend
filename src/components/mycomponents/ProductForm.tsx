import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useArrivals } from '@/hooks/useArrivals'
import { useConditions } from '@/hooks/useConditions'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/lib/products'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import LoaderComponent from './Loader'
import NoData from './NoData'
import { CreateArrival } from '@/lib/arrivals'

// product form props
interface ProductFormProps {
    arrivalId?: string
    data?:
        | (CreateArrival & {
              arrival_number: string
              Products?: Array<
                  Product & {
                      ArrivalProduct: {
                          expected_quantity: number
                          condition_id: number
                      }
                  }
              >
          })
        | null
}

// selected product
interface SelectedProduct {
    product_id: number
    condition_id: number
    expected_quantity: number
    isSelected: boolean
}

const ProductForm = ({ arrivalId, data }: ProductFormProps) => {
    // state
    const [search, setSearch] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({})

    // initialize form with existing data
    useEffect(() => {
        if (data?.arrival_products) {
            const initialProducts: Record<number, SelectedProduct> = {}
            data.arrival_products.forEach((product) => {
                initialProducts[product.product_id] = {
                    product_id: product.product_id,
                    condition_id: product.condition_id,
                    expected_quantity: product.expected_quantity,
                    isSelected: true
                }
            })
            setSelectedProducts(initialProducts)
        }
    }, [data?.arrival_products, arrivalId])

    // hooks
    const { data: products, isLoading: isProductsLoading } = useProducts({
        search: searchQuery || undefined
    })
    const { data: conditions, isLoading: isConditionsLoading } = useConditions()
    const { addProductsToArrival, isAddingProducts, addProductsToArrivalError } = useArrivals()

    // handle search
    const handleSearch = () => {
        setSearchQuery(search)
    }

    // search products
    const searchProducts = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement
            setSearchQuery(target.value)
        }
    }

    // clear search
    const clearSearch = () => {
        setSearch('')
        setSearchQuery('')
    }

    // handle product select
    const handleProductSelect = (productId: number, isChecked: boolean) => {
        setSelectedProducts((prev) => {
            if (!isChecked) {
                // remove the product when unchecked
                const newState = { ...prev }
                delete newState[productId]
                return newState
            }

            // add the product when checked
            return {
                ...prev,
                [productId]: {
                    product_id: productId,
                    condition_id: 0,
                    expected_quantity: 0,
                    isSelected: true
                }
            }
        })
    }

    // handle quantity change
    const handleQuantityChange = (productId: number, quantity: string) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                expected_quantity: parseInt(quantity) || 0
            }
        }))
    }

    // handle condition change
    const handleConditionChange = (productId: number, conditionId: string) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                condition_id: parseInt(conditionId)
            }
        }))
    }

    // handle submit
    const handleSubmit = () => {
        const selectedData = Object.values(selectedProducts).map(({ product_id, condition_id, expected_quantity }) => ({
            product_id,
            condition_id,
            expected_quantity
        }))
        addProductsToArrival({ arrival_number: arrivalId as string, arrival_products: selectedData })
    }

    const hasInvalidProducts = () => {
        return Object.values(selectedProducts).some((product) => !product.expected_quantity || !product.condition_id)
    }

    return (
        <div className="w-full">
            {/* title */}
            <h2 className="my-4">Add Products for Arrival: {arrivalId}</h2>

            {/* search */}
            <div className="flex gap-2 mb-4">
                <Input
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyUp={searchProducts}
                />
                <Button onClick={handleSearch}>Search</Button>
                <Button onClick={clearSearch}>Clear</Button>
            </div>

            {isProductsLoading || isConditionsLoading ? (
                // loader
                <LoaderComponent />
            ) : products && products.items && products.items.length > 0 ? (
                // products
                <>
                    <div className="grid grid-cols-1 gap-4 h-[500px] overflow-y-auto">
                        {products.items.map((product: Product) => (
                            <div
                                key={product.product_id}
                                className="border p-4 rounded-md">
                                {/* product */}
                                <div className="flex items-center gap-4 flex-col">
                                    {/* product name */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={!!selectedProducts[product.product_id]}
                                            onCheckedChange={(checked: boolean) => handleProductSelect(product.product_id, checked)}
                                        />
                                        <h3 className="flex-1">{product.name}</h3>
                                    </div>
                                    {/* quantity */}
                                    <div className="flex gap-4">
                                        <div className="w-full">
                                            <Input
                                                type="number"
                                                placeholder="Quantity"
                                                className="w-full"
                                                value={selectedProducts[product.product_id]?.expected_quantity || ''}
                                                onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                                                disabled={!selectedProducts[product.product_id]}
                                            />
                                            {selectedProducts[product.product_id]?.isSelected &&
                                                !selectedProducts[product.product_id]?.expected_quantity && (
                                                    <span className="text-xs text-red-500">Quantity is required</span>
                                                )}
                                        </div>
                                        {/* condition */}
                                        <div className="w-full">
                                            <Select
                                                value={selectedProducts[product.product_id]?.condition_id?.toString()}
                                                onValueChange={(value) => handleConditionChange(product.product_id, value)}
                                                disabled={!selectedProducts[product.product_id]}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {conditions?.items?.map((condition) => (
                                                        <SelectItem
                                                            key={condition.condition_id}
                                                            value={condition.condition_id.toString()}>
                                                            {condition.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedProducts[product.product_id]?.isSelected &&
                                                !selectedProducts[product.product_id]?.condition_id && (
                                                    <span className="text-xs text-red-500">Condition is required</span>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* error */}
                    {addProductsToArrivalError && <p className="text-red-500">{addProductsToArrivalError.message}</p>}
                    {/* no products selected */}
                    {Object.values(selectedProducts).length === 0 && <span className="text-red-500">you must select at least one product</span>}
                    {/* submit */}
                    <div className="mt-4 w-full">
                        <Button
                            onClick={handleSubmit}
                            className="w-full"
                            disabled={Object.values(selectedProducts).length === 0 || isAddingProducts || hasInvalidProducts()}>
                            {isAddingProducts ? <Loader className="animate-spin" /> : 'Submit Selected Products'}
                        </Button>
                    </div>
                </>
            ) : (
                // no products
                <NoData item="products" />
            )}
        </div>
    )
}

export default ProductForm
