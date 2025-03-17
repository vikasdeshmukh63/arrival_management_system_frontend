import { CreateSize, sizeApi, SizeQueryParams } from '@/lib/size'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSizes = (params?: SizeQueryParams) => {
    // query client
    const queryClient = useQueryClient()

    // query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['sizes', params],
        queryFn: () => sizeApi.getSizes(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    // create size
    const createSizeMutation = useMutation({
        mutationFn: (size: CreateSize) => sizeApi.createSize(size),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['sizes'] })
            toast.success('Size created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    // update size
    const updateSizeMutation = useMutation({
        mutationFn: ({ size_id, size }: { size_id: number; size: CreateSize }) => sizeApi.updateSize(size_id, size),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['sizes'] })
            toast.success('Size updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    // delete size
    const deleteSizeMutation = useMutation({
        mutationFn: (size_id: number) => sizeApi.deleteSize(size_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['sizes'] })
            toast.success('Size deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createSize: createSizeMutation.mutate,
        isCreatingSize: createSizeMutation.isPending,
        createSizeError: createSizeMutation.error,
        updateSize: updateSizeMutation.mutate,
        isUpdatingSize: updateSizeMutation.isPending,
        updateSizeError: updateSizeMutation.error,
        deleteSize: deleteSizeMutation.mutate,
        isDeletingSize: deleteSizeMutation.isPending,
        deleteSizeError: deleteSizeMutation.error
    }
}
