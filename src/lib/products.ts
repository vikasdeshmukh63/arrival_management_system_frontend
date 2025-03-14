import axiosInstance from "./axios-instance";

interface ProductCat {
  category_id: number;
  name: string;
}

interface ProductStyle {
  style_id: number;
  name: string;
}

interface ProductColor {
  color_id: number;
  name: string;
}

interface ProductSize {
  size_id: number;
  name: string;
}

interface ProductBrand {
  brand_id: number;
  name: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Product {
  product_id: number;
  name: string;
  tsku: string;
  barcode: string;
  createdAt: string;
  updatedAt: string;
  Category: ProductCat;
  Style: ProductStyle;
  Color: ProductColor;
  Size: ProductSize;
  Brand: ProductBrand;
}

export interface ProductResponse {
  items: Product[];
  pagination: Pagination;
}

export interface ProductQueryParams {
  order?: string;
  search?: string;
  category?: number;
  style?: number;
  color?: number;
  size?: number;
  brand?: number;
  page?: number;
  itemsPerPage?: number;
}

export interface CreateProduct {
  name: string;
  brand_id: number;
  category_id: number;
  size_id: number;
  color_id: number;
  style_id: number;
}

export const productApi = {
  getProducts: async (params?: ProductQueryParams): Promise<ProductResponse> => {
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

    const { data } = await axiosInstance.get<{ data: ProductResponse }>(`/api/products/get-all${queryString}`);
    return data.data;
  },
  createProduct: async (product: CreateProduct): Promise<Product> => {
    const { data } = await axiosInstance.post<{ data: Product }>(`/api/products/create`, product);
    return data.data;
  },
  updateProduct: async (product_id: number, product: Product): Promise<Product> => {
    const { data } = await axiosInstance.put<{ data: Product }>(`/api/products/${product_id}`, product);
    return data.data;
  },
  deleteProduct: async (product_id: string): Promise<void> => {
    await axiosInstance.delete(`/api/products/${product_id}`);
  },
  deleteManyProducts: async (product_ids: number[]): Promise<void> => {
    await axiosInstance.delete(`/api/products/delete-many`, { data: { product_ids } });
  },
};
