import { CreateSupplier, SupplierQueryParams, supplierApi } from '@/lib/supplier'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSupplier = (params?: SupplierQueryParams) => {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['suppliers', params],
        queryFn: () => supplierApi.getSuppliers(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    const createSupplierMutation = useMutation({
        mutationFn: (supplier: CreateSupplier) => supplierApi.createSupplier(supplier),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast.success('Supplier created successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const updateSupplierMutation = useMutation({
        mutationFn: ({ supplier_id, supplier }: { supplier_id: number; supplier: CreateSupplier }) =>
            supplierApi.updateSupplier(supplier_id, supplier),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast.success('Supplier updated successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const deleteSupplierMutation = useMutation({
        mutationFn: (supplier_id: number) => supplierApi.deleteSupplier(supplier_id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast.success('Supplier deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        data,
        isLoading,
        isError,
        createSupplier: createSupplierMutation.mutate,
        isCreatingSupplier: createSupplierMutation.isPending,
        createSupplierError: createSupplierMutation.error,
        updateSupplier: updateSupplierMutation.mutate,
        isUpdatingSupplier: updateSupplierMutation.isPending,
        updateSupplierError: updateSupplierMutation.error,
        deleteSupplier: deleteSupplierMutation.mutate,
        isDeletingSupplier: deleteSupplierMutation.isPending,
        deleteSupplierError: deleteSupplierMutation.error
    }
}
