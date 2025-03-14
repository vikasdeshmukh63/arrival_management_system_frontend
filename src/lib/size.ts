import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface SizeQueryParams {
  order?: string;
  search?: string;
  page?: number;
  itemsPerPage?: number;
}

export interface Size {
  size_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SizeResponse {
  items: Size[];
  pagination: Pagination;
}

export interface CreateSize {
  name: string;
}

export const sizeApi = {
  getSizes: async (params?: SizeQueryParams): Promise<SizeResponse> => {
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

    const { data } = await axiosInstance.get<{ data: SizeResponse }>(`/api/sizes/get-all${queryString}`);
    return data.data;
  },
  createSize: async (size: CreateSize) => {
    const { data } = await axiosInstance.post("/api/sizes/create", size);
    return data.data;
  },
  updateSize: async (size_id: number, size: CreateSize) => {
    const { data } = await axiosInstance.put(`/api/sizes/${size_id}`, size);
    return data.data;
  },
  deleteSize: async (size_id: number) => {
    const { data } = await axiosInstance.delete(`/api/sizes/${size_id}`);
    return data.data;
  },
  deleteManySizes: async (size_ids: number[]) => {
    const { data } = await axiosInstance.delete(`/api/sizes/delete-many`, {
      data: { ids: size_ids },
    });
    return data.data;
  },
};
