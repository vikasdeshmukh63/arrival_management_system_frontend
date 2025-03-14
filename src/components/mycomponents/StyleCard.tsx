import { Size } from '@/lib/size'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'
import DeleteModal from './DeleteModal'
import { Style } from '@/lib/style'

const StyleCard = ({ style, handleOpenEditDrawer }: { style: Style; handleOpenEditDrawer: (style: Style) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{style.name}</CardHeader>

            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(style)}>
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
                    type="style"
                    id={style.style_id}
                />
            )}
        </Card>
    )
}

export default StyleCard
