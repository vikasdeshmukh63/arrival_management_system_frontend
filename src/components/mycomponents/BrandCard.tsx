import { Brand } from '@/lib/brand'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'
import DeleteModal from './DeleteModal'

const BrandCard = ({ brand, handleOpenEditDrawer }: { brand: Brand; handleOpenEditDrawer: (brand: Brand) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{brand.name}</CardHeader>

            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(brand)}>
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
                    type="brand"
                    id={brand.brand_id}
                />
            )}
        </Card>
    )
}

export default BrandCard
