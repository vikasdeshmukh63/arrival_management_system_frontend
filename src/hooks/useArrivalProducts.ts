import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import arrivalProductApi, { ItemInScanArea } from '@/lib/arrivalProducts'
import { toast } from 'sonner'

export const useArrivalProducts = (arrival_number: string) => {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['arrivalProducts', arrival_number],
        queryFn: () => arrivalProductApi.getArrivalProducts(arrival_number),
        enabled: !!arrival_number,
        staleTime: 0, // Disable caching - data becomes stale immediately
        gcTime: 0 // Remove inactive data immediately
    })

    const scanProduct = useMutation({
        mutationFn: ({ scanned_product }: { scanned_product: ItemInScanArea }) => arrivalProductApi.scanProduct(arrival_number, scanned_product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arrivalProducts', arrival_number] })
            toast.success('Product scanned successfully')
        },
        onError: () => {
            toast.error('Failed to scan product')
        }
    })

    const finishProcessing = useMutation({
        mutationFn: () => arrivalProductApi.finishProcessing(arrival_number),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['arrivalProducts', arrival_number] })
            queryClient.invalidateQueries({ queryKey: ['arrivals'] })
            toast.success('Processing finished successfully')
        },
        onError: () => {
            toast.error('Failed to finish processing')
        }
    })

    return {
        data,
        isLoading,
        isError,
        scanProduct: scanProduct.mutate,
        isScanning: scanProduct.isPending,
        isScanningError: scanProduct.error,
        finishProcessing: finishProcessing.mutateAsync,
        isFinishingProcessing: finishProcessing.isPending,
        isFinishingProcessingError: finishProcessing.error
    }
}
