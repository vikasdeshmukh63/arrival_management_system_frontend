import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import conditionApi, { ConditionQueryParams, CreateCondition } from '@/lib/condition'
import { toast } from 'sonner'

export const useConditions = (params?: ConditionQueryParams) => {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['conditions', params],
        queryFn: () => conditionApi.getConditions(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    const createConditionMutation = useMutation({
        mutationFn: (condition: CreateCondition) => conditionApi.createCondition(condition),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['conditions'] })
            toast.success('Condition created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const updateConditionMutation = useMutation({
        mutationFn: ({ condition_id, condition }: { condition_id: number; condition: CreateCondition }) =>
            conditionApi.updateCondition(condition_id, condition),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['conditions'] })
            toast.success('Condition updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const deleteConditionMutation = useMutation({
        mutationFn: (condition_id: number) => conditionApi.deleteCondition(condition_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['conditions'] })
            toast.success('Condition deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createCondition: createConditionMutation.mutate,
        isCreatingCondition: createConditionMutation.isPending,
        createConditionError: createConditionMutation.error,
        updateCondition: updateConditionMutation.mutate,
        isUpdatingCondition: updateConditionMutation.isPending,
        updateConditionError: updateConditionMutation.error,
        deleteCondition: deleteConditionMutation.mutate,
        isDeletingCondition: deleteConditionMutation.isPending,
        deleteConditionError: deleteConditionMutation.error
    }
}
