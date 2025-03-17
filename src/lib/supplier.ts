import axiosInstance from './axios-instance'
import { Pagination } from './products'

// types
export interface SupplierQueryParams {
    order?: string
    search?: string
    page?: number
    itemsPerPage?: number
}

export interface Supplier {
    supplier_id: number
    name: string
    contact_person: string
    phone: string
    email: string
    address: string
    createdAt: string
    updatedAt: string
}

export interface SupplierResponse {
    items: Supplier[]
    pagination: Pagination
}

export interface CreateSupplier {
    name: string
    contact_person: string
    phone: string
    email: string
    address: string
}

// supplier api
export const supplierApi = {
    getSuppliers: async (params?: SupplierQueryParams): Promise<SupplierResponse> => {
        const queryString = params
            ? '?' +
              new URLSearchParams(
                  Object.entries(params)
                      .filter(([, value]) => value !== undefined)
                      .reduce(
                          (acc, [key, value]) => ({
                              ...acc,
                              [key]: value.toString()
                          }),
                          {}
                      )
              ).toString()
            : ''

        const { data } = await axiosInstance.get<{ data: SupplierResponse }>(`/api/suppliers/get-all${queryString}`)
        return data.data
    },
    createSupplier: async (supplier: CreateSupplier) => {
        const { data } = await axiosInstance.post('/api/suppliers/create', supplier)
        return data.data
    },
    updateSupplier: async (supplier_id: number, supplier: CreateSupplier) => {
        const { data } = await axiosInstance.put(`/api/suppliers/${supplier_id}`, supplier)
        return data.data
    },
    deleteSupplier: async (supplier_id: number) => {
        const { data } = await axiosInstance.delete(`/api/suppliers/${supplier_id}`)
        return data.data
    },
    deleteManySuppliers: async (supplier_ids: number[]) => {
        const { data } = await axiosInstance.delete(`/api/suppliers/delete-many`, {
            data: { ids: supplier_ids }
        })
        return data.data
    }
}
