import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import SupplierDrawer from '@/components/mycomponents/drawers/SupplierDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import SupplierCard from '@/components/mycomponents/SupplierCard'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useSupplier } from '@/hooks/useSupplier'

import { CreateSupplier, Supplier } from '@/lib/supplier'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Suppliers = () => {
    const [searchParams] = useSearchParams()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [supplierToEdit, setSupplierToEdit] = useState<CreateSupplier | null>(null)

    const { data, isLoading, isError } = useSupplier({
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
        setSupplierToEdit(null)
    }

    const handleOpenEditDrawer = (supplier: Supplier) => {
        const supplierToEdit: CreateSupplier & { supplier_id: number } = {
            supplier_id: supplier.supplier_id,
            name: supplier.name,
            contact_person: supplier.contact_person,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address
        }
        setSupplierToEdit(supplierToEdit)
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
                            title="Suppliers"
                            description="Manage your suppliers here"
                            actionLabel="New Supplier"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* Show loading state while data is being fetched */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {data.items.map((supplier: Supplier) => (
                                    <SupplierCard
                                        key={supplier.supplier_id}
                                        supplier={supplier}
                                        handleOpenEditDrawer={handleOpenEditDrawer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData item="suppliers" />
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
                <SupplierDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    data={supplierToEdit as (CreateSupplier & { supplier_id: number }) | null}
                />
            )}
        </Layout>
    )
}

export default Suppliers
