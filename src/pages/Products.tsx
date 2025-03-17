import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import ProductDrawer from '@/components/mycomponents/drawers/ProductDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import ProductCard from '@/components/mycomponents/cards/ProductCard'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useProducts } from '@/hooks/useProducts'
import { CreateProduct, Product } from '@/lib/products'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Products = () => {
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [productToEdit, setProductToEdit] = useState<(CreateProduct & { tsku: string }) | null>(null)

    const { data, isLoading, isError } = useProducts({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        brand: searchParams.get('brand') ? parseInt(searchParams.get('brand')!) : undefined,
        category: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
        color: searchParams.get('color') ? parseInt(searchParams.get('color')!) : undefined,
        size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined,
        style: searchParams.get('style') ? parseInt(searchParams.get('style')!) : undefined,
        order: searchParams.get('order') || undefined
    })

    useEffect(() => {
        if (isError) {
            toast.error('Error fetching products')
        }
    }, [isError])

    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setProductToEdit(null)
    }

    const handleOpenEditDrawer = (product: Product) => {
        const productToEdit: CreateProduct & { tsku: string } = {
            name: product.name,
            brand_id: product.Brand.brand_id,
            category_id: product.Category.category_id,
            size_id: product.Size.size_id,
            color_id: product.Color.color_id,
            style_id: product.Style.style_id,
            tsku: product.tsku
        }
        setProductToEdit(productToEdit)
        setIsDrawerOpen(true)
    }

    return (
        <Layout>
            {/* Use flex-col and min-h-full to ensure full height */}
            <div className="flex flex-col min-h-full">
                {/* Main content area with padding and auto height */}
                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
                        <PageHeader
                            title="Products"
                            description="Manage your products here"
                            actionLabel="New Product"
                            onAction={handleOpenCreateDrawer}
                            filters={
                                <FilterToolbar
                                    enableBrands={true}
                                    enableColors={true}
                                    enableSizes={true}
                                    enableStyles={true}
                                    enableCategories={true}
                                />
                            }
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((product: Product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData item="products" />
                        )}
                    </div>
                </div>

                {/* Pagination fixed at the bottom */}
                {data && data.pagination && (
                    <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-background">
                        <CustomPagination pagination={data.pagination} />
                    </div>
                )}
            </div>

            {/* Product Drawer */}
            {isDrawerOpen && (
                <ProductDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={productToEdit}
                />
            )}
        </Layout>
    )
}

export default Products
