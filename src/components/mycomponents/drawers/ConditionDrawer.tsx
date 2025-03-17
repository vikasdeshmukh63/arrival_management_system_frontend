import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useConditions } from '@/hooks/useConditions'
import { CreateCondition } from '@/lib/condition'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// condition schema
const conditionSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required')
})

// condition form data
type ConditionFormData = z.infer<typeof conditionSchema>

const ConditionDrawer = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateCondition & { condition_id: number }) | null
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
    } = useForm<ConditionFormData>({
        resolver: zodResolver(conditionSchema)
    })

    // hooks
    const { createCondition, isCreatingCondition, createConditionError, updateCondition, isUpdatingCondition, updateConditionError } = useConditions()

    // reset form and close drawer
    useEffect(() => {
        if (isSubmittingRef.current && !isCreatingCondition && !updateConditionError) {
            if (!createConditionError) {
                reset()
                onClose()
            }
            isSubmittingRef.current = false
        }
    }, [isCreatingCondition, createConditionError, onClose, reset, updateConditionError])

    // on submit
    const onSubmit = async (formData: ConditionFormData) => {
        try {
            isSubmittingRef.current = true
            if (!data) {
                createCondition(formData)
            } else {
                updateCondition({ condition_id: data.condition_id as number, condition: formData })
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
                    <SheetTitle>{data ? 'Update' : 'Add'} Condition</SheetTitle>
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
                {updateConditionError && updateConditionError instanceof AxiosError && (
                    <span className="text-xs text-red-500">{updateConditionError.response?.data.message}</span>
                )}
                {/* sheet footer */}
                <SheetFooter>
                    <Button onClick={() => submitRef.current?.click()}>
                        {isCreatingCondition || isUpdatingCondition ? <Loader className="animate-spin" /> : `${data ? 'Update' : 'Create'} Condition`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ConditionDrawer
