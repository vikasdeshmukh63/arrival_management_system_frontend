import { useQuery } from '@tanstack/react-query'
import arrivalProductApi from '@/lib/arrivalProducts'

export const useArrivalProducts = (arrival_number: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['arrivalProducts', arrival_number],
        queryFn: () => arrivalProductApi.getArrivalProducts(arrival_number),
        enabled: !!arrival_number,
        staleTime: 0, // Disable caching - data becomes stale immediately
        gcTime: 0 // Remove inactive data immediately
    })

    return { data, isLoading, isError }
}
