import SupplierCard from '@/components/mycomponents/cards/SupplierCard'
import { CustomPagination } from '@/components/mycomponents/CustomPagination'
import SupplierDrawer from '@/components/mycomponents/drawers/SupplierDrawer'
import { FilterToolbar } from '@/components/mycomponents/FilterToolbar'
import LoaderComponent from '@/components/mycomponents/Loader'
import NoData from '@/components/mycomponents/NoData'
import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useSupplier } from '@/hooks/useSupplier'

import { CreateSupplier, Supplier } from '@/lib/supplier'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Suppliers = () => {
    // search params
    const [searchParams] = useSearchParams()

    // state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [supplierToEdit, setSupplierToEdit] = useState<CreateSupplier | null>(null)

    // hooks
    const { data, isLoading, isError } = useSupplier({
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
        setSupplierToEdit(null)
    }

    // handle open edit drawer
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
            <div className="flex flex-col min-h-full">
                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    {/* main content */}
                    <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
                        {/* page header */}
                        <PageHeader
                            title="Suppliers"
                            description="Manage your suppliers here"
                            actionLabel="New Supplier"
                            onAction={handleOpenCreateDrawer}
                            filters={<FilterToolbar />}
                        />

                        {/* loading state */}
                        {isLoading ? (
                            <LoaderComponent />
                        ) : data && data.items && data.items.length > 0 ? (
                            // suppliers
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
                            // no data
                            <NoData item="suppliers" />
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

            {/* supplier drawer */}
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
