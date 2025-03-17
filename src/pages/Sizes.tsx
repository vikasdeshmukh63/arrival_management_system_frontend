import SizeCard from '@/components/mycomponents/cards/SizeCard'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import SizeDrawer from '@/components/mycomponents/drawers/SizeDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useSizes } from '@/hooks/useSizes'
import { CreateSize, Size } from '@/lib/size'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Sizes = () => {
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [sizeToEdit, setSizeToEdit] = useState<CreateSize | null>(null)

    // hooks
    const { data, isLoading, isError } = useSizes({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined
    })

    // if there is an error, show a toast
    useEffect(() => {
        if (isError) {
            toast.error('Error fetching sizes')
        }
    }, [isError])

    // handle open create drawer
    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setSizeToEdit(null)
    }

    // handle open edit drawer
    const handleOpenEditDrawer = (size: Size) => {
        const sizeToEdit: CreateSize & { size_id: number } = {
            size_id: size.size_id,
            name: size.name
        }
        setSizeToEdit(sizeToEdit)
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
                            title="Colors"
                            description="Manage your colors here"
                            actionLabel="New Color"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* loading state */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            // sizes
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((size: Size) => (
                                    <SizeCard
                                        key={size.size_id}
                                        size={size}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            // no data
                            <NoData item="colors" />
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

            {/* size drawer */}
            {isDrawerOpen && (
                <SizeDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={sizeToEdit as (CreateSize & { size_id: number }) | null}
                />
            )}
        </Layout>
    )
}

export default Sizes
