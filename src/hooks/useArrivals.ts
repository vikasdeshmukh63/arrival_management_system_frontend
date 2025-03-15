import { arrivalApi, ArrivalQueryParams, CreateArrival, ArrivalProduct } from '@/lib/arrivals'
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
        mutationFn: ({ arrival_number, arrival }: { arrival_number: string; arrival: CreateArrival }) =>
            arrivalApi.updateArrival(arrival_number, arrival),
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

    const addProductsToArrivalMutation = useMutation({
        mutationFn: ({ arrival_number, arrival_products }: { arrival_number: string; arrival_products: ArrivalProduct[] }) =>
            arrivalApi.addProductsToArrival(arrival_number, arrival_products),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            toast.success('Products added to arrival successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createArrival: createArrivalMutation.mutateAsync,
        isCreating: createArrivalMutation.isPending,
        createArrivalError: createArrivalMutation.error,
        isUpdating: updateArrivalMutation.isPending,
        updateArrivalError: updateArrivalMutation.error,
        isDeletingArrival: deleteArrivalMutation.isPending,
        deleteArrivalError: deleteArrivalMutation.error,
        updateArrival: updateArrivalMutation.mutate,
        deleteArrival: deleteArrivalMutation.mutate,
        addProductsToArrival: addProductsToArrivalMutation.mutate,
        isAddingProducts: addProductsToArrivalMutation.isPending,
        addProductsToArrivalError: addProductsToArrivalMutation.error
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
