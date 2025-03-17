import axiosInstance from './axios-instance'
import { Pagination } from './products'

// types
export interface ColorQueryParams {
    order?: string
    search?: string
    page?: number
    itemsPerPage?: number
}

export interface Color {
    color_id: number
    name: string
    createdAt: string
    updatedAt: string
}

export interface ColorResponse {
    items: Color[]
    pagination: Pagination
}

export interface CreateColor {
    name: string
}

// color api
export const colorApi = {
    getColors: async (params?: ColorQueryParams): Promise<ColorResponse> => {
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

        const { data } = await axiosInstance.get<{ data: ColorResponse }>(`/api/colors/get-all${queryString}`)
        return data.data
    },
    createColor: async (color: CreateColor) => {
        const { data } = await axiosInstance.post(`/api/colors/create`, color)
        return data.data
    },
    updateColor: async (color_id: number, color: CreateColor) => {
        const { data } = await axiosInstance.put(`/api/colors/${color_id}`, color)
        return data.data
    },
    deleteColor: async (color_id: number) => {
        const { data } = await axiosInstance.delete(`/api/colors/${color_id}`)
        return data.data
    },
    deleteManyColors: async (color_ids: number[]) => {
        const { data } = await axiosInstance.delete(`/api/colors/delete-many`, {
            data: { ids: color_ids }
        })
        return data.data
    }
}
