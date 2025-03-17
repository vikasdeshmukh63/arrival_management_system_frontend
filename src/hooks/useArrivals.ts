import { arrivalApi, ArrivalQueryParams, CreateArrival, ArrivalProduct, StartProcessing } from '@/lib/arrivals'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const useArrivals = (params?: ArrivalQueryParams) => {
    // navigate hook
    const navigate = useNavigate()

    // query client
    const queryClient = useQueryClient()

    // query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['arrivals', params],
        queryFn: () => arrivalApi.getArrivals(params),
        staleTime: 0,
        gcTime: 0
    })

    // create arrival
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

    // update arrival
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

    // delete arrival
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

    // add products to arrival
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

    // start processing
    const startProcessingMutation = useMutation({
        mutationFn: ({ arrival_number, arrival_data }: { arrival_number: string; arrival_data: StartProcessing }) =>
            arrivalApi.startProcessing(arrival_number, arrival_data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            navigate(`/arrivals/processing/${data.arrival_number}`)
            toast.success('Processing started successfully')
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
        addProductsToArrivalError: addProductsToArrivalMutation.error,
        startProcessing: startProcessingMutation.mutateAsync,
        isStartingProcessing: startProcessingMutation.isPending,
        startProcessingError: startProcessingMutation.error
    }
}
// Separate hook for getting a single arrival by ID
export const useArrival = (arrival_number: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['individual-arrival', arrival_number],
        queryFn: () => arrivalApi.getArrivalById(arrival_number),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        enabled: !!arrival_number // Only run the query if we have an arrival_id
    })

    return {
        arrival: data,
        isLoading,
        isError
    }
}
