import { Size } from '@/lib/size'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'
import DeleteModal from './DeleteModal'

const SizeCard = ({ size, handleOpenEditDrawer }: { size: Size; handleOpenEditDrawer: (size: Size) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{size.name}</CardHeader>

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

            {/* Delete Modal */}
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
