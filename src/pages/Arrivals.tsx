import ArrivalCard from '@/components/mycomponents/ArrivalCard'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import ArrivalDrawer from '@/components/mycomponents/drawers/ArrivalDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useArrivals } from '@/hooks/useArrivals'
import { Arrival, CreateArrival } from '@/lib/arrivals'
import { Product } from '@/lib/products'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Arrivals = () => {
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [arrivalToEdit, setArrivalToEdit] = useState<(CreateArrival & { arrival_number: string }) | null>(null)
    const [createdArrival, setCreatedArrival] = useState<(CreateArrival & { arrival_number: string }) | null>(null)

    const { data, isLoading, isError } = useArrivals({
        page: parseInt(searchParams.get('page') || '1'),
        itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
        search: searchParams.get('search') || undefined,
        order: searchParams.get('order') || undefined,
        status: searchParams.get('status') || undefined,
        ne: searchParams.get('ne') || undefined
    })

    useEffect(() => {
        if (isError) {
            toast.error('Error fetching brands')
        }
    }, [isError])

    const handleOpenCreateDrawer = () => {
        setIsDrawerOpen(true)
        setArrivalToEdit(null)
    }

    const handleOpenEditDrawer = (arrival: Arrival) => {
        const arrivalToEdit: CreateArrival & { arrival_number: string } = {
            title: arrival.title,
            supplier_id: arrival.Supplier.supplier_id,
            expected_boxes: arrival.expected_boxes,
            expected_kilograms: arrival.expected_kilograms,
            expected_pieces: arrival.expected_pieces,
            expected_pallets: arrival.expected_pallets,
            expected_date: new Date(arrival.expected_date),
            notes: arrival.notes,
            arrival_number: arrival.arrival_number,
            arrival_products: arrival.Products.map((p) => ({
                product_id: (p as unknown as Product).product_id,
                expected_quantity: p.ArrivalProduct.expected_quantity,
                condition_id: p.ArrivalProduct.condition_id
            }))
        }
        setArrivalToEdit(arrivalToEdit)
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
                            title="Arrivals"
                            description="Manage your arrivals here"
                            actionLabel="New Arrival"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar status={true} />}
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((arrival: Arrival) => (
                                    <ArrivalCard
                                        key={arrival.arrival_id}
                                        arrival={arrival}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                        setCreatedArrival={setCreatedArrival}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData item="arrivals" />
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
                <ArrivalDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    setCreatedArrival={setCreatedArrival}
                    createdArrival={createdArrival}
                    data={arrivalToEdit}
                />
            )}
        </Layout>
    )
}

export default Arrivals
