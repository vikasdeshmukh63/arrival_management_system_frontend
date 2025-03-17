import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Condition } from '@/lib/condition'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const ConditionCard = ({ condition, handleOpenEditDrawer }: { condition: Condition; handleOpenEditDrawer: (condition: Condition) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{condition.name}</CardHeader>
            {/* card content */}
            <CardContent className="text-sm text-gray-500">{condition.description}</CardContent>
            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(condition)}>
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
                    type="condition"
                    id={condition.condition_id}
                />
            )}
        </Card>
    )
}

export default ConditionCard
