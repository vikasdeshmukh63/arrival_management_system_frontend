import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface StyleQueryParams {
  order?: string;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}

export interface Style {
  style_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleResponse {
  items: Style[];
  pagination: Pagination;
}

export const styleApi = {
  getStyles: async (params?: StyleQueryParams): Promise<StyleResponse> => {
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

    const { data } = await axiosInstance.get<{ data: StyleResponse }>(`/api/styles/get-all${queryString}`);
    return data.data;
  },
};
