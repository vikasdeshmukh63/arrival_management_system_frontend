import { Condition, CreateCondition } from '@/lib/condition'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import ConditionDrawer from '@/components/mycomponents/drawers/ConditionDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useConditions } from '@/hooks/useConditions'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import ConditionCard from '@/components/mycomponents/cards/ConditionCard'

const Conditions = () => {
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [conditionToEdit, setConditionToEdit] = useState<CreateCondition | null>(null)

    // hooks
    const { data, isLoading, isError } = useConditions({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined
    })

    // if there is an error, show a toast
    useEffect(() => {
        if (isError) {
            toast.error('Error fetching conditions')
        }
    }, [isError])

    // handle open create drawer
    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setConditionToEdit(null)
    }

    // handle open edit drawer
    const handleOpenEditDrawer = (condition: Condition) => {
        const conditionToEdit: CreateCondition & { condition_id: number } = {
            condition_id: condition.condition_id,
            name: condition.name,
            description: condition.description
        }
        setConditionToEdit(conditionToEdit)
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
                            title="Conditions"
                            description="Manage your conditions here"
                            actionLabel="New Condition"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* loading state */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            // conditions
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((condition: Condition) => (
                                    <ConditionCard
                                        key={condition.condition_id}
                                        condition={condition}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            // no data
                            <NoData item="conditions" />
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

            {/* condition drawer */}
            {isDrawerOpen && (
                <ConditionDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={conditionToEdit as (CreateCondition & { condition_id: number }) | null}
                />
            )}
        </Layout>
    )
}

export default Conditions
