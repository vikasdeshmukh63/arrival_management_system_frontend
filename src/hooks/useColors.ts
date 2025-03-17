import { colorApi, ColorQueryParams, CreateColor } from '@/lib/color'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useColors = (params?: ColorQueryParams) => {
    // query client
    const queryClient = useQueryClient()

    // query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['colors', params],
        queryFn: () => colorApi.getColors(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    // create color
    const createColorMutation = useMutation({
        mutationFn: (color: CreateColor) => colorApi.createColor(color),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['colors'] })
            toast.success('Color created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    // update color
    const updateColorMutation = useMutation({
        mutationFn: ({ color_id, color }: { color_id: number; color: CreateColor }) => colorApi.updateColor(color_id, color),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['colors'] })
            toast.success('Color updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    // delete color
    const deleteColorMutation = useMutation({
        mutationFn: (color_id: number) => colorApi.deleteColor(color_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['colors'] })
            toast.success('Color deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return {
        data,
        isLoading,
        isError,
        createColor: createColorMutation.mutate,
        isCreatingColor: createColorMutation.isPending,
        createColorError: createColorMutation.error,
        updateColor: updateColorMutation.mutate,
        isUpdatingColor: updateColorMutation.isPending,
        updateColorError: updateColorMutation.error,
        deleteColor: deleteColorMutation.mutate,
        isDeletingColor: deleteColorMutation.isPending,
        deleteColorError: deleteColorMutation.error
    }
}
