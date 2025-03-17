import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Supplier } from '@/lib/supplier'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const SupplierCard = ({ supplier, handleOpenEditDrawer }: { supplier: Supplier; handleOpenEditDrawer: (supplier: Supplier) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{supplier.name}</CardHeader>
            {/* card content */}
            <CardContent>
                <div className="grid grid-cols-1 gap-2">
                    {/* contact person */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Contact Person :</span> {supplier.contact_person}
                    </p>
                    {/* phone */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Phone :</span> {supplier.phone}
                    </p>
                    {/* email */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Email :</span> {supplier.email}
                    </p>
                    {/* address */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Address :</span> {supplier.address}
                    </p>
                </div>
            </CardContent>
            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(supplier)}>
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => setOpenDeleteModal(true)}>
                    Delete
                </Button>
            </CardFooter>

            {/* delete modal */}
            {openDeleteModal && (
                <DeleteModal
                    open={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    type="supplier"
                    id={supplier.supplier_id}
                />
            )}
        </Card>
    )
}

export default SupplierCard
