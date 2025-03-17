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
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [brandToEdit, setBrandToEdit] = useState<CreateBrand | null>(null)

    // hooks
    const { data, isLoading, isError } = useBrands({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined
    })

    // if there is an error, show a toast
    useEffect(() => {
        if (isError) {
            toast.error('Error fetching brands')
        }
    }, [isError])

    // handle open create drawer
    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setBrandToEdit(null)
    }

    // handle open edit drawer
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
            <div className="flex flex-col min-h-full">
                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    {/* main content */}
                    <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
                        {/* page header */}
                        <PageHeader
                            title="Brands"
                            description="Manage your brands here"
                            actionLabel="New Brand"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* loading state */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            // brands
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
                            // no data
                            <NoData item="brands" />
                        )}
                    </div>
                </div>

                {/* pagination */}
                {data && data.pagination && (
                    <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-background">
                        <CustomPagination pagination={data.pagination} />
                    </div>
                )}
            </div>

            {/* brand drawer */}
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
