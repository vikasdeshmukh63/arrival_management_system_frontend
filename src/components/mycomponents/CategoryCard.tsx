import { Category } from '@/lib/category'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import DeleteModal from './DeleteModal'

const CategoryCard = ({ category, handleOpenEditDrawer }: { category: Category; handleOpenEditDrawer: (category: Category) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{category.name}</CardHeader>
            <CardContent className="text-sm text-gray-500">{category.description}</CardContent>

            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(category)}>
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
                    type="category"
                    id={category.category_id}
                />
            )}
        </Card>
    )
}

export default CategoryCard
