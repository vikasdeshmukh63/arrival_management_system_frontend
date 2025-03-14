import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface CategoryQueryParams {
  order?: string;
  search?: string;
  page?: number;
  rowsPerPage?: number;
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
};
