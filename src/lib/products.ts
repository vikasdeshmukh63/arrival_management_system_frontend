import axiosInstance from './axios-instance'

// types
export interface ProductCat {
    category_id: number
    name: string
}

export interface ProductStyle {
    style_id: number
    name: string
}

export interface ProductColor {
    color_id: number
    name: string
}

export interface ProductSize {
    size_id: number
    name: string
}

export interface ProductBrand {
    brand_id: number
    name: string
}

export interface Pagination {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface Product {
    product_id: number
    name: string
    tsku: string
    barcode: string
    createdAt: string
    updatedAt: string
    Category: ProductCat
    Style: ProductStyle
    Color: ProductColor
    Size: ProductSize
    Brand: ProductBrand
}

export interface ProductResponse {
    items: Product[]
    pagination: Pagination
}

export interface ProductQueryParams {
    order?: string
    search?: string
    category?: number
    style?: number
    color?: number
    size?: number
    brand?: number
    page?: number
    itemsPerPage?: number
}

export interface CreateProduct {
    name: string
    brand_id: number
    category_id: number
    size_id: number
    color_id: number
    style_id: number
}

// product api
export const productApi = {
    getProducts: async (params?: ProductQueryParams): Promise<ProductResponse> => {
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

        const { data } = await axiosInstance.get<{ data: ProductResponse }>(`/api/products/get-all${queryString}`)
        return data.data
    },
    createProduct: async (product: CreateProduct): Promise<Product> => {
        const { data } = await axiosInstance.post<{ data: Product }>(`/api/products/create`, product)
        return data.data
    },
    updateProduct: async (tsku: string, product: CreateProduct): Promise<number[]> => {
        const { data } = await axiosInstance.put<{ data: number[] }>(`/api/products/${tsku}`, product)
        return data.data
    },
    deleteProduct: async (tsku: string): Promise<void> => {
        await axiosInstance.delete(`/api/products/${tsku}`)
    },
    deleteManyProducts: async (tsku: string[]): Promise<void> => {
        await axiosInstance.delete(`/api/products/delete-many`, { data: { tsku } })
    }
}
