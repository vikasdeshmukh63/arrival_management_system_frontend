import { arrivalApi, ArrivalQueryParams, CreateArrival } from '@/lib/arrivals'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useArrivals = (params?: ArrivalQueryParams) => {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['arrivals', params],
        queryFn: () => arrivalApi.getArrivals(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    const createArrivalMutation = useMutation({
        mutationFn: (arrival: CreateArrival) => arrivalApi.createArrival(arrival),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            toast.success('Arrival created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const updateArrivalMutation = useMutation({
        mutationFn: ({ arrival_id, arrival }: { arrival_id: number; arrival: CreateArrival }) => arrivalApi.updateArrival(arrival_id, arrival),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            toast.success('Arrival updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const deleteArrivalMutation = useMutation({
        mutationFn: (arrival_id: number) => arrivalApi.deleteArrival(arrival_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            toast.success('Arrival deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createArrival: createArrivalMutation.mutate,
        createArrivalError: createArrivalMutation.error,
        isUpdating: updateArrivalMutation.isPending,
        updateArrivalError: updateArrivalMutation.error,
        isDeleting: deleteArrivalMutation.isPending,
        deleteArrivalError: deleteArrivalMutation.error,
        updateArrival: updateArrivalMutation.mutate,
        deleteArrival: deleteArrivalMutation.mutate
    }
}
// Separate hook for getting a single arrival by ID
export const useArrival = (arrival_id: number) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['arrival', arrival_id],
        queryFn: () => arrivalApi.getArrivalById(arrival_id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        enabled: !!arrival_id // Only run the query if we have an arrival_id
    })

    return {
        arrival: data,
        isLoading,
        isError
    }
}
