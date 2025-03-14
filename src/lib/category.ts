import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface CategoryQueryParams {
  order?: string;
  search?: string;
  page?: number;
  itemsPerPage?: number;
}

export interface Category {
  category_id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  items: Category[];
  pagination: Pagination;
}

export interface CreateCategory {
  name: string;
  description: string;
}

export const categoryApi = {
  getCategories: async (params?: CategoryQueryParams): Promise<CategoryResponse> => {
    const queryString = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value.toString(),
              }),
              {}
            )
        ).toString()
      : "";

    const { data } = await axiosInstance.get<{ data: CategoryResponse }>(`/api/categories/get-all${queryString}`);
    return data.data;
  },
  createCategory: async (data: CreateCategory) => {
    const { data: response } = await axiosInstance.post("/api/categories/create", data);
    return response.data;
  },
  updateCategory: async (category_id: number, data: CreateCategory) => {
    const { data: response } = await axiosInstance.put(`/api/categories/${category_id}`, data);
    return response.data;
  },
  deleteCategory: async (category_id: number) => {
    const { data: response } = await axiosInstance.delete(`/api/categories/${category_id}`);
    return response.data;
  },
  deleteManyCategories: async (category_ids: number[]) => {
    const { data: response } = await axiosInstance.delete("/api/categories/delete-many", { data: { ids: category_ids } });
    return response.data;
  },
};
