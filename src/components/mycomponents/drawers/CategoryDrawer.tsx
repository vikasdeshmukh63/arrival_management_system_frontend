import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/useCategories'
import { CreateCategory } from '@/lib/category'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// category schema
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required')
})

// category form data
type CategoryFormData = z.infer<typeof categorySchema>

const CategoryDrawer = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateCategory & { category_id: number }) | null
}) => {
    // state
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    // form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema)
    })

    // hooks
    const { createCategory, isCreatingCategory, createCategoryError, updateCategory, isUpdatingCategory, updateCategoryError } = useCategories()

    // reset form and close drawer
    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingCategory && !updateCategoryError) {
            if (!createCategoryError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingCategory, createCategoryError, onClose, reset, updateCategoryError])

    // on submit
    const onSubmit = async (formData: CategoryFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createCategory(formData)
            } else {
                updateCategory({ category_id: data.category_id as number, category: formData })
            }
        } catch (error) {
            console.error(error)
            isSubmittingRef.current = false
        }
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onClose}>
            <SheetContent className="px-4">
                {/* sheet header */}
                <SheetHeader>
                    <SheetTitle>{data ? 'Update' : 'Add'} Product</SheetTitle>
                </SheetHeader>
                {/* sheet content */}
                <div className="w-full">
                    <form
                        className="w-full border p-4 rounded-md flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}>
                        {/* name */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                placeholder="Name"
                                id="name"
                                {...register('name')}
                                defaultValue={data?.name}
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        {/* description */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                placeholder="Description"
                                id="description"
                                {...register('description')}
                                defaultValue={data?.description}
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                        </div>
                        {/* submit button */}
                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {/* error */}
                {updateCategoryError && updateCategoryError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateCategoryError.response?.data.message}</span>
                )}
                {/* sheet footer */}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingCategory || isUpdatingCategory ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Category`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CategoryDrawer
