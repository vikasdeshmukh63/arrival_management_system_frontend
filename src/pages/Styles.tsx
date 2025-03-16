import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import StyleDrawer from '@/components/mycomponents/drawers/StyleDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import StyleCard from '@/components/mycomponents/cards/StyleCard'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useStyles } from '@/hooks/useStyles'
import { CreateStyle, Style } from '@/lib/style'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Styles = () => {
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [styleToEdit, setStyleToEdit] = useState<CreateStyle | null>(null)

    const { data, isLoading, isError } = useStyles({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined
    })

    useEffect(() => {
        if (isError) {
            toast.error('Error fetching sizes')
        }
    }, [isError])

    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setStyleToEdit(null)
    }

    const handleOpenEditDrawer = (style: Style) => {
        const styleToEdit: CreateStyle & { style_id: number } = {
            style_id: style.style_id,
            name: style.name
        }
        setStyleToEdit(styleToEdit)
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
                            title="Colors"
                            description="Manage your colors here"
                            actionLabel="New Color"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((style: Style) => (
                                    <StyleCard
                                        key={style.style_id}
                                        style={style}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData item="colors" />
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
                <StyleDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={styleToEdit as (CreateStyle & { style_id: number }) | null}
                />
            )}
        </Layout>
    )
}

export default Styles
