import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSupplier } from '@/hooks/useSupplier'
import { CreateSupplier } from '@/lib/supplier'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const brandSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    contact_person: z.string().min(1, 'Contact Person is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().min(1, 'Email is required'),
    address: z.string().min(1, 'Address is required')
})

type BrandFormData = z.infer<typeof brandSchema>

const SupplierDrawer = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateSupplier & { supplier_id: number }) | null
}) => {
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

    const { createSupplier, isCreatingSupplier, createSupplierError, updateSupplier, isUpdatingSupplier, updateSupplierError } = useSupplier()

    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingSupplier && !updateSupplierError) {
            if (!createSupplierError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingSupplier, createSupplierError, onClose, reset, updateSupplierError])

    const onSubmit = async (formData: BrandFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createSupplier(formData)
            } else {
                updateSupplier({ supplier_id: data.supplier_id, supplier: formData })
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
                    <SheetTitle>{data ? 'Update' : 'Add'} Supplier</SheetTitle>
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
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input
                                type="text"
                                placeholder="Contact Person"
                                id="contact_person"
                                {...register('contact_person')}
                                defaultValue={data?.contact_person}
                            />
                            {errors.contact_person && <span className="text-xs text-red-500">{errors.contact_person.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">Phone </Label>
                            <Input
                                type="text"
                                placeholder="Phone"
                                id="phone"
                                {...register('phone')}
                                defaultValue={data?.phone}
                            />
                            {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="text"
                                placeholder="Email"
                                id="email"
                                {...register('email')}
                                defaultValue={data?.email}
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                type="text"
                                placeholder="Address"
                                id="address"
                                {...register('address')}
                                defaultValue={data?.address}
                            />
                            {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
                        </div>
                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {updateSupplierError && updateSupplierError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateSupplierError.response?.data.message}</span>
                )}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingSupplier || isUpdatingSupplier ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Supplier`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default SupplierDrawer
