import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useArrivals } from '@/hooks/useArrivals'
import { StartProcessing } from '@/lib/arrivals'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const startProcessingSchema = z.object({
    received_pallets: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().int().min(0).optional())
        .optional(),
    received_boxes: z
        .string()
        .transform((val) => Number(val))
        .pipe(z.number().int().min(0)),
    received_pieces: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().int().min(0).optional())
        .optional(),
    received_kilograms: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(z.number().min(0).optional())
        .optional()
})

type StartProcessingFormData = z.infer<typeof startProcessingSchema>

const StartProcessingDrawer = ({
    isOpen,
    onClose,
    arrivalToStartProcessing
}: {
    isOpen: boolean
    onClose: () => void
    arrivalToStartProcessing: string | null
}) => {
    const submitRef = useRef<HTMLButtonElement>(null)
    const isSubmittingRef = useRef(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<StartProcessingFormData>({
        resolver: zodResolver(startProcessingSchema)
    })

    const { startProcessing, isStartingProcessing, startProcessingError } = useArrivals()

    useEffect(() => {
        if (isSubmittingRef.current && !isStartingProcessing && !startProcessingError) {
            if (!startProcessingError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isStartingProcessing, startProcessingError, onClose, reset])

    const onSubmit = async (formData: StartProcessingFormData) => {
        try {
            isSubmittingRef.current = true
            const processedData: StartProcessing = {
                received_boxes: formData.received_boxes
            }

            if (formData.received_pallets !== undefined) {
                processedData.received_pallets = formData.received_pallets
            }
            if (formData.received_pieces !== undefined) {
                processedData.received_pieces = formData.received_pieces
            }
            if (formData.received_kilograms !== undefined) {
                processedData.received_kilograms = formData.received_kilograms
            }

            startProcessing({
                arrival_number: arrivalToStartProcessing!,
                arrival_data: processedData
            })
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
                    <SheetTitle>Start Processing</SheetTitle>
                </SheetHeader>
                <div className="w-full">
                    <form
                        className="w-full border p-4 rounded-md flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="received_boxes">Received Boxes</Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Received Boxes"
                                id="received_boxes"
                                {...register('received_boxes')}
                            />
                            {errors.received_boxes && <span className="text-xs text-red-500">{errors.received_boxes.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="received_pallets">Received Pallets</Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Received Pallets"
                                id="received_pallets"
                                {...register('received_pallets')}
                            />
                            {errors.received_pallets && <span className="text-xs text-red-500">{errors.received_pallets.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="received_pieces">Received Pieces</Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Received Pieces"
                                id="received_pieces"
                                {...register('received_pieces')}
                            />
                            {errors.received_pieces && <span className="text-xs text-red-500">{errors.received_pieces.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="received_kilograms">Received Kilograms</Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Received Kilograms"
                                id="received_kilograms"
                                {...register('received_kilograms')}
                            />
                            {errors.received_kilograms && <span className="text-xs text-red-500">{errors.received_kilograms.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="hidden"
                            ref={submitRef}
                        />
                    </form>
                </div>
                {startProcessingError && startProcessingError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{startProcessingError.response?.data.message}</span>
                )}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isStartingProcessing ? <Loader className="animate-spin" /> : 'Start Processing'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default StartProcessingDrawer
