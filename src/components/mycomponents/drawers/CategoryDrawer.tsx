import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/useCategories'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required')
})

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
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema)
    })

    const { createCategory, isCreatingCategory, createCategoryError, updateCategory, isUpdatingCategory, updateCategoryError } = useCategories()

    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingCategory && !updateCategoryError) {
            if (!createCategoryError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingCategory, createCategoryError, onClose, reset, updateCategoryError])

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
                <SheetHeader>
                    <SheetTitle>{data ? 'Update' : 'Add'} Product</SheetTitle>
                </SheetHeader>
                <div className="w-full">
                    <form
                        className="w-full border p-4 rounded-md flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}>
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

                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {updateCategoryError && updateCategoryError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateCategoryError.response?.data.message}</span>
                )}
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
