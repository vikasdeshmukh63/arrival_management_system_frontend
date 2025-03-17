import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Product } from '@/lib/products'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const ProductCard = ({ product, handleOpenEditDrawer }: { product: Product; handleOpenEditDrawer: (product: Product) => void }) => {
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader>{product.name}</CardHeader>
            {/* card content */}
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {/* category */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Category :</span> {product.Category.name}
                    </p>
                    {/* style */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Style :</span> {product.Style.name}
                    </p>
                    {/* color */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Color :</span> {product.Color.name}
                    </p>
                    {/* size */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Size :</span> {product.Size.name}
                    </p>
                    {/* brand */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Brand :</span> {product.Brand.name}
                    </p>
                </div>
            </CardContent>
            {/* card badge */}
            <Badge
                variant="default"
                className="absolute top-2 right-2 font-bold">
                {product.tsku}
            </Badge>
            {/* card footer */}
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

            {/* delete modal */}
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
