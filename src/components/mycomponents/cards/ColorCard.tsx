import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Color } from '@/lib/color'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const ColorCard = ({ color, handleOpenEditDrawer }: { color: Color; handleOpenEditDrawer: (color: Color) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{color.name}</CardHeader>

            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(color)}>
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
                    type="color"
                    id={color.color_id}
                />
            )}
        </Card>
    )
}

export default ColorCard
