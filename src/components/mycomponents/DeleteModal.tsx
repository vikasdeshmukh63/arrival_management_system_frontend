import { useProducts } from '@/hooks/useProducts'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useBrands } from '@/hooks/useBrands'
import { useCategories } from '@/hooks/useCategories'
import { useColors } from '@/hooks/useColors'
import { Loader } from 'lucide-react'
import { useConditions } from '@/hooks/useConditions'
import { useSizes } from '@/hooks/useSizes'
import { useStyles } from '@/hooks/useStyles'
import { useSupplier } from '@/hooks/useSupplier'
import { useArrivals } from '@/hooks/useArrivals'

const DeleteModal = ({ open, setOpen, type, id }: { open: boolean; setOpen: (open: boolean) => void; type: string; id: string | number }) => {
    // state
    const [error, setError] = useState<Error | null>(null)

    // delete hooks
    const { deleteProduct, deleteProductError, isDeletingProduct } = useProducts()
    const { deleteBrand, deleteBrandError, isDeletingBrand } = useBrands()
    const { deleteCategory, deleteCategoryError, isDeletingCategory } = useCategories()
    const { deleteColor, deleteColorError, isDeletingColor } = useColors()
    const { deleteCondition, deleteConditionError, isDeletingCondition } = useConditions()
    const { deleteSize, deleteSizeError, isDeletingSize } = useSizes()
    const { deleteStyle, deleteStyleError, isDeletingStyle } = useStyles()
    const { deleteSupplier, deleteSupplierError, isDeletingSupplier } = useSupplier()
    const { deleteArrival, deleteArrivalError, isDeletingArrival } = useArrivals()

    // handle delete
    const handleDelete = () => {
        switch (type) {
            case 'product':
                deleteProduct(id as string)
                setError(deleteProductError as Error)
                break
            case 'brand':
                deleteBrand(id as number)
                setError(deleteBrandError)
                break
            case 'category':
                deleteCategory(id as number)
                setError(deleteCategoryError)
                break
            case 'color':
                deleteColor(id as number)
                setError(deleteColorError)
                break
            case 'condition':
                deleteCondition(id as number)
                setError(deleteConditionError)
                break
            case 'size':
                deleteSize(id as number)
                setError(deleteSizeError)
                break
            case 'style':
                deleteStyle(id as number)
                setError(deleteStyleError)
                break
            case 'supplier':
                deleteSupplier(id as number)
                setError(deleteSupplierError)
                break
            case 'arrival':
                deleteArrival(id as number)
                setError(deleteArrivalError)
                break
        }
    }

    // if error, show toast
    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogContent>
                {/* dialog header */}
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this {type}?</DialogTitle>
                </DialogHeader>
                {/* dialog footer */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}>
                        {isDeletingProduct ||
                        isDeletingBrand ||
                        isDeletingCategory ||
                        isDeletingColor ||
                        isDeletingCondition ||
                        isDeletingSize ||
                        isDeletingStyle ||
                        isDeletingSupplier ||
                        isDeletingArrival ? (
                            <Loader className="animate-spin" />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteModal
