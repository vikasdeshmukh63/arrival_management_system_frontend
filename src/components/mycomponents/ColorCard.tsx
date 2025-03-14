import { Brand } from '@/lib/brand'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'
import DeleteModal from './DeleteModal'
import { Color } from '@/lib/color'

const ColorCard = ({ color, handleOpenEditDrawer }: { color: Color; handleOpenEditDrawer: (color: Color) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{color.name}</CardHeader>

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

            {/* Delete Modal */}
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
