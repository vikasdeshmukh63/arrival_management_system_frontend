import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Category } from '@/lib/category'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const CategoryCard = ({ category, handleOpenEditDrawer }: { category: Category; handleOpenEditDrawer: (category: Category) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{category.name}</CardHeader>
            {/* card content */}
            <CardContent className="text-sm text-gray-500">{category.description}</CardContent>
            {/* card footer */}
            <CardFooter className="flex justify-between items-center">
                {/* edit */}
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(category)}>
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
                    type="category"
                    id={category.category_id}
                />
            )}
        </Card>
    )
}

export default CategoryCard
