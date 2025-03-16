import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useColors } from '@/hooks/useColors'
import { CreateColor } from '@/lib/color'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const colorSchema = z.object({
    name: z.string().min(1, 'Name is required')
})

type ColorFormData = z.infer<typeof colorSchema>

const ColorDrawer = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: (CreateColor & { color_id: number }) | null }) => {
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ColorFormData>({
        resolver: zodResolver(colorSchema)
    })

    const { createColor, isCreatingColor, createColorError, updateColor, isUpdatingColor, updateColorError } = useColors()

    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingColor && !updateColorError) {
            if (!createColorError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingColor, createColorError, onClose, reset, updateColorError])

    const onSubmit = async (formData: ColorFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createColor(formData)
            } else {
                updateColor({ color_id: data.color_id, color: formData })
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
                    <SheetTitle>{data ? 'Update' : 'Add'} Color</SheetTitle>
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
                {updateColorError && updateColorError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateColorError.response?.data.message}</span>
                )}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingColor || isUpdatingColor ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Color`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ColorDrawer
