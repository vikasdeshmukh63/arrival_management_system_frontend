import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Brand } from '@/lib/brand'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const BrandCard = ({ brand, handleOpenEditDrawer }: { brand: Brand; handleOpenEditDrawer: (brand: Brand) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{brand.name}</CardHeader>

            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                {/* edit */}
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(brand)}>
                    Edit
                </Button>
                {/* delete */}
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
                    type="brand"
                    id={brand.brand_id}
                />
            )}
        </Card>
    )
}

export default BrandCard
