import BrandCard from '@/components/mycomponents/cards/BrandCard'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import BrandDrawer from '@/components/mycomponents/drawers/BrandDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useBrands } from '@/hooks/useBrands'
import { Brand, CreateBrand } from '@/lib/brand'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Brands = () => {
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [brandToEdit, setBrandToEdit] = useState<CreateBrand | null>(null)

    const { data, isLoading, isError } = useBrands({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined
    })

    useEffect(() => {
        if (isError) {
            toast.error('Error fetching brands')
        }
    }, [isError])

    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setBrandToEdit(null)
    }

    const handleOpenEditDrawer = (brand: Brand) => {
        const brandToEdit: CreateBrand & { brand_id: number } = {
            brand_id: brand.brand_id,
            name: brand.name
        }
        setBrandToEdit(brandToEdit)
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
                            title="Brands"
                            description="Manage your brands here"
                            actionLabel="New Brand"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((brand: Brand) => (
                                    <BrandCard
                                        key={brand.brand_id}
                                        brand={brand}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData item="brands" />
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
                <BrandDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={brandToEdit as CreateBrand & { brand_id: number }}
                />
            )}
        </Layout>
    )
}

export default Brands
