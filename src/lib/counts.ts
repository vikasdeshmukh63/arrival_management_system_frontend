import axiosInstance from './axios-instance'

interface ArrivalCounts {
    total: number
    upcoming: number
    in_progress: number
    finished: number
    with_discrepancy: number
}

interface EntitiesCount {
    brands: number
    categories: number
    colors: number
    conditions: number
    products: number
    sizes: number
    styles: number
    suppliers: number
}

export const countApi = {
    getArrivalCounts: async (): Promise<ArrivalCounts> => {
        const { data } = await axiosInstance.get<{ data: ArrivalCounts }>('/api/statistics/arrivals')
        return data.data
    },

    getEntitesCount: async (): Promise<EntitiesCount> => {
        const { data } = await axiosInstance.get<{ data: EntitiesCount }>('/api/statistics/entities')
        return data.data
    }
}
