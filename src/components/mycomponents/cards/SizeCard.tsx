import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Size } from '@/lib/size'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const SizeCard = ({ size, handleOpenEditDrawer }: { size: Size; handleOpenEditDrawer: (size: Size) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{size.name}</CardHeader>

            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(size)}>
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
                    type="size"
                    id={size.size_id}
                />
            )}
        </Card>
    )
}

export default SizeCard
