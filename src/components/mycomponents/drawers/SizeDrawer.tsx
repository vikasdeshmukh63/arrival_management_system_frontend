import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSizes } from '@/hooks/useSizes'
import { CreateSize } from '@/lib/size'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// size schema
const sizeSchema = z.object({
    name: z.string().min(1, 'Name is required')
})

// size form data
type SizeFormData = z.infer<typeof sizeSchema>

const SizeDrawer = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: (CreateSize & { size_id: number }) | null }) => {
    // state
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    // form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SizeFormData>({
        resolver: zodResolver(sizeSchema)
    })

    // hooks
    const { createSize, isCreatingSize, createSizeError, updateSize, isUpdatingSize, updateSizeError } = useSizes()

    // reset form and close drawer
    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingSize && !updateSizeError) {
            if (!createSizeError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingSize, createSizeError, onClose, reset, updateSizeError])

    // on submit
    const onSubmit = async (formData: SizeFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createSize(formData)
            } else {
                updateSize({ size_id: data.size_id, size: formData })
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
                    <SheetTitle>{data ? 'Update' : 'Add'} Size</SheetTitle>
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
                        {/* submit button */}
                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {/* error */}
                {updateSizeError && updateSizeError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateSizeError.response?.data.message}</span>
                )}
                {/* sheet footer */}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingSize || isUpdatingSize ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Size`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default SizeDrawer
