import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Product } from '@/lib/products'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

const ProductCard = ({ product, handleOpenEditDrawer }: { product: Product; handleOpenEditDrawer: (product: Product) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    return (
        <Card className="relative">
            <CardHeader>{product.name}</CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Category :</span> {product.Category.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Style :</span> {product.Style.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Color :</span> {product.Color.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Size :</span> {product.Size.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Brand :</span> {product.Brand.name}
                    </p>
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
