import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface BrandQueryParams {
  order?: string;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}

export interface Brand {
  brand_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandResponse {
  items: Brand[];
  pagination: Pagination;
}

export const brandApi = {
  getBrands: async (params?: BrandQueryParams): Promise<BrandResponse> => {
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

    const { data } = await axiosInstance.get<{ data: BrandResponse }>(`/api/brands/get-all${queryString}`);
    return data.data;
  },
};
