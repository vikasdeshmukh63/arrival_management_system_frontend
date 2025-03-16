import axiosInstance from './axios-instance'
import { Pagination, Product } from './products'

export interface ArrivalQueryParams {
    order?: string
    search?: string
    status?: string
    page?: number
    itemsPerPage?: number
    ne?: string | boolean
}

export interface Arrival {
    arrival_id: number
    arrival_number: string
    title: string
    expected_date: string
    started_date: string
    finished_date: string | null
    status: string
    expected_pallets: number
    expected_boxes: number
    expected_kilograms: number | null
    expected_pieces: number
    received_pallets: number
    received_boxes: number
    received_kilograms: string | null
    received_pieces: number
    notes: string | null
    createdAt: string
    updatedAt: string
    Supplier: {
        supplier_id: number
        name: string
    }
    Products: Product &
        {
            ArrivalProduct: {
                expected_quantity: number
                received_quantity: number
                condition_id: number
            }
        }[]
}

export interface ArrivalResponse {
    items: Arrival[]
    pagination: Pagination
}

export interface CreateArrival {
    title: string
    supplier_id: number
    expected_boxes: number
    expected_kilograms?: number | null
    expected_pieces?: number
    expected_pallets?: number
    notes?: string | null
    expected_date: Date
    arrival_products?: ArrivalProduct[]
}

export interface ArrivalProduct {
    product_id: number
    expected_quantity: number
    condition_id: number
}

export interface StartProcessing {
    received_pallets?: number
    received_boxes: number
    received_pieces?: number
    received_kilograms?: number
}

export const arrivalApi = {
    getArrivals: async (params?: ArrivalQueryParams): Promise<ArrivalResponse> => {
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

        const { data } = await axiosInstance.get<{ data: ArrivalResponse }>(`/api/arrivals/get-all${queryString}`)
        return data.data
    },
    getArrivalById: async (arrival_id: number): Promise<Arrival> => {
        const { data } = await axiosInstance.get<{ data: Arrival }>(`/api/arrivals/${arrival_id}`)
        return data.data
    },
    createArrival: async (arrival: CreateArrival): Promise<Arrival> => {
        const { data } = await axiosInstance.post<{ data: Arrival }>(`/api/arrivals/create`, arrival)
        return data.data
    },
    updateArrival: async (arrival_number: string, arrival: CreateArrival): Promise<number[]> => {
        const { data } = await axiosInstance.put<{ data: number[] }>(`/api/arrivals/${arrival_number}`, arrival)
        return data.data
    },
    deleteArrival: async (arrival_id: number): Promise<number[]> => {
        const { data } = await axiosInstance.delete<{ data: number[] }>(`/api/arrivals/${arrival_id}`)
        return data.data
    },
    addProductsToArrival: async (arrival_number: string, arrival_products: ArrivalProduct[]): Promise<number[]> => {
        const { data } = await axiosInstance.post<{ data: number[] }>(`/api/arrivals/add-products/${arrival_number}`, { arrival_products })
        return data.data
    },
    startProcessing: async (arrival_number: string, arrival_data: StartProcessing): Promise<{ arrival_number: string; status: string }> => {
        const { data } = await axiosInstance.post<{ data: { arrival_number: string; status: string } }>(
            `/api/arrivals/start-processing/${arrival_number}`,
            arrival_data
        )
        return data.data
    }
}
