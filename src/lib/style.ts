import axiosInstance from './axios-instance'
import { Pagination } from './products'

// types
export interface StyleQueryParams {
    order?: string
    search?: string
    page?: number
    itemsPerPage?: number
}

export interface Style {
    style_id: number
    name: string
    createdAt: string
    updatedAt: string
}

export interface StyleResponse {
    items: Style[]
    pagination: Pagination
}

export interface CreateStyle {
    name: string
}

// style api
export const styleApi = {
    getStyles: async (params?: StyleQueryParams): Promise<StyleResponse> => {
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

        const { data } = await axiosInstance.get<{ data: StyleResponse }>(`/api/styles/get-all${queryString}`)
        return data.data
    },
    createStyle: async (style: CreateStyle) => {
        const { data } = await axiosInstance.post('/api/styles/create', style)
        return data.data
    },
    updateStyle: async (style_id: number, style: CreateStyle) => {
        const { data } = await axiosInstance.put(`/api/styles/${style_id}`, style)
        return data.data
    },
    deleteStyle: async (style_id: number) => {
        const { data } = await axiosInstance.delete(`/api/styles/${style_id}`)
        return data.data
    },
    deleteManyStyles: async (style_ids: number[]) => {
        const { data } = await axiosInstance.delete('/api/styles/delete-many', { data: { ids: style_ids } })
        return data.data
    }
}
