import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useBrands } from '@/hooks/useBrands'
import { CreateBrand } from '@/lib/brand'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// brand schema
const brandSchema = z.object({
    name: z.string().min(1, 'Name is required')
})

// brand form data
type BrandFormData = z.infer<typeof brandSchema>

const BrandDrawer = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: (CreateBrand & { brand_id: number }) | null }) => {
    // state
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    // form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<BrandFormData>({
        resolver: zodResolver(brandSchema)
    })

    // hooks
    const { createBrand, isCreatingBrand, createBrandError, updateBrand, isUpdatingBrand, updateBrandError } = useBrands()

    // reset form and close drawer
    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingBrand && !updateBrandError) {
            if (!createBrandError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingBrand, createBrandError, onClose, reset, updateBrandError])

    // on submit
    const onSubmit = async (formData: BrandFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createBrand(formData)
            } else {
                updateBrand({ brand_id: data.brand_id as number, brand: formData })
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

                        {/* submit button */}
                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {/* error */}
                {updateBrandError && updateBrandError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateBrandError.response?.data.message}</span>
                )}
                {/* sheet footer */}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingBrand || isUpdatingBrand ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Product`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default BrandDrawer
