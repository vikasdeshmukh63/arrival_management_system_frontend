import { Product } from '@/lib/products'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { useState } from 'react'
import DeleteModal from './DeleteModal'

const ProductCard = ({ product, handleOpenEditDrawer }: { product: Product; handleOpenEditDrawer: (product: Product) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{product.name}</CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-gray-500">Category : {product.Category.name}</p>
                    <p className="text-sm text-gray-500">Style : {product.Style.name}</p>
                    <p className="text-sm text-gray-500">Color : {product.Color.name}</p>
                    <p className="text-sm text-gray-500">Size : {product.Size.name}</p>
                    <p className="text-sm text-gray-500">Brand : {product.Brand.name}</p>
                </div>
            </CardContent>
            <Badge
                variant="default"
                className="absolute top-2 right-2 font-bold">
                {product.tsku}
            </Badge>
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => handleOpenEditDrawer(product)}>
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
                    type="product"
                    id={product.tsku}
                />
            )}
        </Card>
    )
}

export default ProductCard
