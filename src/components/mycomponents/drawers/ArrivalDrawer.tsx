import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useBrands } from '@/hooks/useBrands'
import { useCategories } from '@/hooks/useCategories'
import { useColors } from '@/hooks/useColors'
import { useProducts } from '@/hooks/useProducts'
import { useSizes } from '@/hooks/useSizes'
import { useStyles } from '@/hooks/useStyles'
import { BrandResponse } from '@/lib/brand'
import { CategoryResponse } from '@/lib/category'
import { ColorResponse } from '@/lib/color'
import { CreateProduct } from '@/lib/products'
import { SizeResponse } from '@/lib/size'
import { StyleResponse } from '@/lib/style'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import CustomSelect from '../CustomSelect'
import { CreateArrival } from '@/lib/arrivals'

const arrivalSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    supplier_id: z.number().min(1, 'Supplier is required'),
    expected_date: z.string().min(1, 'Expected date is required'),
    started_date: z.string().min(1, 'Started date is required'),
    finished_date: z.string().min(1, 'Finished date is required'),
    status: z.string().min(1, 'Status is required')
})

type ArrivalFormData = z.infer<typeof arrivalSchema>

const ArrivalDrawer = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateArrival & { arrival_number: string }) | null
}) => {
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<ArrivalFormData>({
        resolver: zodResolver(arrivalSchema)
    })

    const { createArrival, isCreatingArrival, createArrivalError, updateArrival, isUpdatingArrival, updateArrivalError } = useArrivals()

    const { data: categoryData } = useCategories() as { data: CategoryResponse | undefined }

    const { data: brandData } = useBrands() as { data: BrandResponse | undefined }

    const { data: sizeData } = useSizes() as { data: SizeResponse | undefined }

    const { data: colorData } = useColors() as { data: ColorResponse | undefined }

    const { data: styleData } = useStyles() as { data: StyleResponse | undefined }

    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingArrival) {
            if (!createArrivalError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingArrival, createArrivalError, onClose, reset])

    const onSubmit = async (formData: ArrivalFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createArrival(formData)
            } else {
                updateArrival({ arrival_number: data.arrival_number, arrival: formData })
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
                            <Label htmlFor="category">Category</Label>
                            <Controller
                                name="category_id"
                                control={control}
                                defaultValue={data?.category_id}
                                render={({ field }) => (
                                    <CustomSelect
                                        placeholder="Select Category"
                                        data={categoryData?.items || []}
                                        onChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString() || ''}
                                        getItemKey={(item) => item.category_id}
                                        getItemLabel={(item) => item.name}
                                    />
                                )}
                            />
                            {errors.category_id && <span className="text-xs text-red-500">{errors.category_id.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Controller
                                name="brand_id"
                                control={control}
                                defaultValue={data?.brand_id}
                                render={({ field }) => (
                                    <CustomSelect
                                        placeholder="Select Brand"
                                        data={brandData?.items || []}
                                        onChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString() || ''}
                                        getItemKey={(item) => item.brand_id}
                                        getItemLabel={(item) => item.name}
                                    />
                                )}
                            />
                            {errors.brand_id && <span className="text-xs text-red-500">{errors.brand_id.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="size">Size</Label>
                            <Controller
                                name="size_id"
                                control={control}
                                defaultValue={data?.size_id}
                                render={({ field }) => (
                                    <CustomSelect
                                        placeholder="Select Size"
                                        data={sizeData?.items || []}
                                        onChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString() || ''}
                                        getItemKey={(item) => item.size_id}
                                        getItemLabel={(item) => item.name}
                                    />
                                )}
                            />
                            {errors.size_id && <span className="text-xs text-red-500">{errors.size_id.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="color">Color</Label>
                            <Controller
                                name="color_id"
                                control={control}
                                defaultValue={data?.color_id}
                                render={({ field }) => (
                                    <CustomSelect
                                        placeholder="Select Color"
                                        data={colorData?.items || []}
                                        onChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString() || ''}
                                        getItemKey={(item) => item.color_id}
                                        getItemLabel={(item) => item.name}
                                    />
                                )}
                            />
                            {errors.color_id && <span className="text-xs text-red-500">{errors.color_id.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="style">Style</Label>
                            <Controller
                                name="style_id"
                                control={control}
                                defaultValue={data?.style_id}
                                render={({ field }) => (
                                    <CustomSelect
                                        placeholder="Select Style"
                                        data={styleData?.items || []}
                                        onChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString() || ''}
                                        getItemKey={(item) => item.style_id}
                                        getItemLabel={(item) => item.name}
                                    />
                                )}
                            />
                            {errors.style_id && <span className="text-xs text-red-500">{errors.style_id.message}</span>}
                        </div>
                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {createProductError && createProductError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{createProductError.response?.data.message}</span>
                )}
                {updateProductError && updateProductError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateProductError.response?.data.message}</span>
                )}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingProduct || isUpdatingProduct ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Product`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ArrivalDrawer
