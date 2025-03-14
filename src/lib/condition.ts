import axiosInstance from './axios-instance'
import { Pagination } from './products'

export interface ConditionQueryParams {
    order?: string
    search?: string
    page?: number
    itemsPerPage?: number
}

export interface Condition {
    condition_id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface ConditionResponse {
    items: Condition[]
    pagination: Pagination
}

export interface CreateCondition {
    name: string
    description: string
}

const conditionApi = {
    getConditions: async (params?: ConditionQueryParams): Promise<ConditionResponse> => {
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

        const { data } = await axiosInstance.get<{ data: ConditionResponse }>(`/api/conditions/get-all${queryString}`)
        return data.data
    },
    createCondition: async (condition: CreateCondition): Promise<Condition> => {
        const response = await axiosInstance.post<Condition>('/api/conditions/create', condition)
        return response.data
    },
    updateCondition: async (condition_id: number, condition: CreateCondition): Promise<Condition> => {
        const response = await axiosInstance.put<Condition>(`/api/conditions/${condition_id}`, condition)
        return response.data
    },
    deleteCondition: async (condition_id: number): Promise<void> => {
        await axiosInstance.delete(`/api/conditions/${condition_id}`)
    },
    deleteManyConditions: async (condition_ids: number[]): Promise<void> => {
        await axiosInstance.delete('/api/conditions/delete-many', { data: { ids: condition_ids } })
    }
}

export default conditionApi
