import { useArrivals } from '@/hooks/useArrivals'
import { useSupplier } from '@/hooks/useSupplier'
import { Arrival, CreateArrival } from '@/lib/arrivals'
import { SupplierResponse } from '@/lib/supplier'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import CustomSelect from './CustomSelect'

const arrivalSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    supplier_id: z.number().min(1, 'Supplier is required'),
    expected_boxes: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().min(1, 'Expected boxes is required')),
    expected_kilograms: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().min(1).positive().optional()),
    expected_date: z
        .string()
        .transform((val) => new Date(val))
        .pipe(z.date().min(new Date(), 'Expected date must be in the future')),
    expected_pallets: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().min(1).positive().optional()),
    expected_pieces: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().min(1).positive().optional()),
    notes: z.string().optional()
})

type ArrivalFormData = z.infer<typeof arrivalSchema>

const ArrivalForm = ({
    data,
    setSelectedTab,
    onSuccess
}: {
    data?: (CreateArrival & { arrival_number: string }) | null
    setSelectedTab: (tab: 'arrival' | 'products') => void
    onSuccess?: (arrival: CreateArrival & { arrival_number: string }) => void
}) => {
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

    const { createArrival, createArrivalError, isCreating, updateArrival, updateArrivalError } = useArrivals()

    const { data: supplierData } = useSupplier() as { data: SupplierResponse | undefined }

    useEffect(() => {
        if (data) {
            // reset({
            //     title: data.title,
            //     supplier_id: Number(data.supplier_id),
            //     expected_boxes: Number(data.expected_boxes),
            //     expected_kilograms: Number(data.expected_kilograms),
            //     expected_pallets: Number(data.expected_pallets),
            //     expected_pieces: Number(data.expected_pieces),
            //     expected_date: new Date(data.expected_date),
            //     notes: data.notes as string
            // })
        } else {
            reset()
        }
    }, [data, reset])

    useEffect(() => {
        // Only reset if we were submitting and there are no errors
        if (isSubmittingRef.current && !createArrivalError && !updateArrivalError && !isCreating) {
            reset()
            setSelectedTab('products')
            isSubmittingRef.current = false
        } else if ((createArrivalError || updateArrivalError) && isSubmittingRef.current) {
            // If there was an error, just reset the submitting flag
            isSubmittingRef.current = false
        }
    }, [createArrivalError, updateArrivalError, isCreating, reset, setSelectedTab])

    const onSubmit = async (formData: ArrivalFormData) => {
        try {
            isSubmittingRef.current = true
            // Filter out undefined and empty optional fields
            const cleanedFormData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => {
                    // Keep required fields regardless of value
                    if (['title', 'supplier_id', 'expected_boxes', 'expected_date'].includes(key)) {
                        return true
                    }
                    // Filter out empty optional fields
                    return value !== undefined && value !== ''
                })
            ) as unknown as ArrivalFormData

            if (!data) {
                const result = await createArrival(cleanedFormData)
                if (onSuccess && result) {
                    onSuccess({
                        ...cleanedFormData,
                        arrival_number: (result as Arrival).arrival_number
                    })
                }
            } else {
                await updateArrival({ arrival_number: data.arrival_number, arrival: cleanedFormData })
            }
        } catch (error) {
            console.error(error)
            isSubmittingRef.current = false
        }
    }
    return (
        <div className="w-full">
            <form
                className="w-full border p-4 rounded-md flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        type="text"
                        placeholder="Title"
                        id="title"
                        {...register('title')}
                        defaultValue={data?.title}
                    />
                    {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="supplier_id">Supplier</Label>
                    <Controller
                        name="supplier_id"
                        control={control}
                        defaultValue={data?.supplier_id}
                        render={({ field }) => (
                            <CustomSelect
                                placeholder="Select Supplier"
                                data={supplierData?.items || []}
                                onChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString() || ''}
                                getItemKey={(item) => item.supplier_id}
                                getItemLabel={(item) => item.name}
                            />
                        )}
                    />
                    {errors.supplier_id && <span className="text-xs text-red-500">{errors.supplier_id.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expected_boxes">Expected Boxes</Label>
                    <Input
                        type="number"
                        placeholder="Expected Boxes"
                        id="expected_boxes"
                        defaultValue={data?.expected_boxes}
                        {...register('expected_boxes')}
                    />
                    {errors.expected_boxes && <span className="text-xs text-red-500">{errors.expected_boxes.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expected_kilograms">Expected Kilograms</Label>
                    <Input
                        type="number"
                        placeholder="Expected Kilograms"
                        id="expected_kilograms"
                        defaultValue={data?.expected_kilograms}
                        {...register('expected_kilograms')}
                    />
                    {errors.expected_kilograms && <span className="text-xs text-red-500">{errors.expected_kilograms.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expected_pallets">Expected Pallets</Label>
                    <Input
                        type="number"
                        placeholder="Expected Pallets"
                        id="expected_pallets"
                        defaultValue={data?.expected_pallets}
                        {...register('expected_pallets')}
                    />
                    {errors.expected_pallets && <span className="text-xs text-red-500">{errors.expected_pallets.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expected_pieces">Expected Pieces</Label>
                    <Input
                        type="number"
                        placeholder="Expected Pieces"
                        id="expected_pieces"
                        defaultValue={data?.expected_pieces}
                        {...register('expected_pieces')}
                    />
                    {errors.expected_pieces && <span className="text-xs text-red-500">{errors.expected_pieces.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="expected_date">Expected Date</Label>
                    <Input
                        type="date"
                        placeholder="Expected Date"
                        id="expected_date"
                        {...register('expected_date')}
                        defaultValue={data?.expected_date ? new Date(data.expected_date).toISOString().split('T')[0] : undefined}
                    />
                    {errors.expected_date && <span className="text-xs text-red-500">{errors.expected_date.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        placeholder="Notes"
                        id="notes"
                        defaultValue={data?.notes as string}
                        {...register('notes')}
                    />
                    {errors.notes && <span className="text-xs text-red-500">{errors.notes.message}</span>}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isCreating}>
                    {isCreating ? <Loader className="animate-spin" /> : 'Submit'}
                </Button>
            </form>
            {createArrivalError && createArrivalError instanceof AxiosError && (
                <span className="text-xs text-red-500">{createArrivalError.response?.data.message}</span>
            )}
            {updateArrivalError && updateArrivalError instanceof AxiosError && (
                <span className="text-xs text-red-500">{updateArrivalError.response?.data.message}</span>
            )}
        </div>
    )
}

export default ArrivalForm
