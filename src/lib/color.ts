import axiosInstance from "./axios-instance";
import { Pagination } from "./products";

export interface ColorQueryParams {
  order?: string;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}

export interface Color {
  color_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColorResponse {
  items: Color[];
  pagination: Pagination;
}

export const colorApi = {
  getColors: async (params?: ColorQueryParams): Promise<ColorResponse> => {
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

    const { data } = await axiosInstance.get<{ data: ColorResponse }>(`/api/colors/get-all${queryString}`);
    return data.data;
  },
};
