import { Supplier } from '@/lib/supplier'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { useState } from 'react'
import DeleteModal from './DeleteModal'

const SupplierCard = ({ supplier, handleOpenEditDrawer }: { supplier: Supplier; handleOpenEditDrawer: (supplier: Supplier) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{supplier.name}</CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-2">
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Contact Person :</span> {supplier.contact_person}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Phone :</span> {supplier.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Email :</span> {supplier.email}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Address :</span> {supplier.address}
                    </p>
                </div>
            </CardContent>
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

            {/* Delete Modal */}
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
