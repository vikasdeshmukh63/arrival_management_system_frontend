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
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<(CreateCategory & { category_id: number }) | null>(null)

    const { data, isLoading, isError } = useCategories({
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
        setCategoryToEdit(null)
    }

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
            {/* Use flex-col and min-h-full to ensure full height */}
            <div className="flex flex-col min-h-full">
                {/* Main content area with padding and auto height */}
                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
                        <PageHeader
                            title="Categories"
                            description="Manage your categories here"
                            actionLabel="New Category"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
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
                            <NoData item="categories" />
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
