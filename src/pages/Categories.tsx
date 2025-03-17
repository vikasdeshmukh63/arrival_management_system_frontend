import CategoryCard from '@/components/mycomponents/cards/CategoryCard'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import CategoryDrawer from '@/components/mycomponents/drawers/CategoryDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useCategories } from '@/hooks/useCategories'
import { Category, CreateCategory } from '@/lib/category'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Categories = () => {
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<(CreateCategory & { category_id: number }) | null>(null)

    // hooks
    const { data, isLoading, isError } = useCategories({
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
        setCategoryToEdit(null)
    }

    // handle open edit drawer
    const handleOpenEditDrawer = (category: Category) => {
        const categoryToEdit: CreateCategory & { category_id: number } = {
            category_id: category.category_id,
            name: category.name,
            description: category.description
        }
        setCategoryToEdit(categoryToEdit)
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
                            title="Categories"
                            description="Manage your categories here"
                            actionLabel="New Category"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* loading state */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            // categories
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((category: Category) => (
                                    <CategoryCard
                                        key={category.category_id}
                                        category={category}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            // no data
                            <NoData item="categories" />
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

            {/* category drawer */}
            {isDrawerOpen && (
                <CategoryDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={categoryToEdit}
                />
            )}
        </Layout>
    )
}

export default Categories
