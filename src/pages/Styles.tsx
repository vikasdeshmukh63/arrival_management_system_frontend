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
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [styleToEdit, setStyleToEdit] = useState<CreateStyle | null>(null)

    // hooks
    const { data, isLoading, isError } = useStyles({
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
        setStyleToEdit(null)
    }

    // handle open edit drawer
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
                            // styles
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

            {/* style drawer */}
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
