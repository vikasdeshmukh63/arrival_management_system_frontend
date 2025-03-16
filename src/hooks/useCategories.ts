import { categoryApi, CategoryQueryParams, CreateCategory } from '@/lib/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCategories = (params?: CategoryQueryParams) => {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories', params],
        queryFn: () => categoryApi.getCategories(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    const createCategoryMutation = useMutation({
        mutationFn: (category: CreateCategory) => categoryApi.createCategory(category),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Category created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const updateCategoryMutation = useMutation({
        mutationFn: ({ category_id, category }: { category_id: number; category: CreateCategory }) =>
            categoryApi.updateCategory(category_id, category),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Category updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const deleteCategoryMutation = useMutation({
        mutationFn: (category_id: number) => categoryApi.deleteCategory(category_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Category deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createCategory: createCategoryMutation.mutate,
        isCreatingCategory: createCategoryMutation.isPending,
        createCategoryError: createCategoryMutation.error,
        updateCategory: updateCategoryMutation.mutate,
        isUpdatingCategory: updateCategoryMutation.isPending,
        updateCategoryError: updateCategoryMutation.error,
        deleteCategory: deleteCategoryMutation.mutate,
        isDeletingCategory: deleteCategoryMutation.isPending,
        deleteCategoryError: deleteCategoryMutation.error
    }
}
