import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface BrandQueryParams {
  order?: string;
  search?: string;
  page?: number;
  itemsPerPage?: number;
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

export interface CreateBrand {
  brand_id?: number;
  name: string;
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
  createBrand: async (brand: CreateBrand) => {
    const { data } = await axiosInstance.post(`/api/brands/create`, brand);
    return data.data;
  },
  updateBrand: async (brand_id: number, brand: CreateBrand) => {
    const { data } = await axiosInstance.put(`/api/brands/${brand_id}`, brand);
    return data.data;
  },
  deleteBrand: async (brand_id: number) => {
    const { data } = await axiosInstance.delete(`/api/brands/${brand_id}`);
    return data.data;
  },
  deleteManyBrands: async (brand_ids: number[]) => {
    const { data } = await axiosInstance.delete(`/api/brands/delete-many`, { data: { brand_ids } });
    return data.data;
  },
};
