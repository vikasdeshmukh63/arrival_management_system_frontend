import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface SizeQueryParams {
  order?: string;
  search?: string;
  page?: number;
  rowsPerPage?: number;
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
};
