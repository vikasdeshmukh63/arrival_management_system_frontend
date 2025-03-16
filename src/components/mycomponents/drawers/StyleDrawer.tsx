import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useStyles } from '@/hooks/useStyles'
import { CreateStyle } from '@/lib/style'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const brandSchema = z.object({
    name: z.string().min(1, 'Name is required')
})

type BrandFormData = z.infer<typeof brandSchema>

const StyleDrawer = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: (CreateStyle & { style_id: number }) | null }) => {
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<BrandFormData>({
        resolver: zodResolver(brandSchema)
    })

    const { createStyle, isCreatingStyle, createStyleError, updateStyle, isUpdatingStyle, updateStyleError } = useStyles()

    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingStyle && !updateStyleError) {
            if (!createStyleError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingStyle, createStyleError, onClose, reset, updateStyleError])

    const onSubmit = async (formData: BrandFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createStyle(formData)
            } else {
                updateStyle({ style_id: data.style_id, style: formData })
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
                    <SheetTitle>{data ? 'Update' : 'Add'} Size</SheetTitle>
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

                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {updateStyleError && updateStyleError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateStyleError.response?.data.message}</span>
                )}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingStyle || isUpdatingStyle ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Style`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default StyleDrawer
