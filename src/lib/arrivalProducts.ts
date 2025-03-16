import { ProductBrand, ProductCat, ProductColor, ProductSize, ProductStyle } from '@/lib/products'
import axiosInstance from './axios-instance'

export interface DetailedArrivalProduct {
    arrival_product_id: number
    arrival_id: number
    product_id: number
    condition_id: number
    expected_quantity: number
    received_quantity: number
    createdAt: string
    updatedAt: string
    Product: {
        product_id: number
        name: string
        tsku: string
        barcode: string
        createdAt: string
        updatedAt: string
        Category: ProductCat
        Style: ProductStyle
        Brand: ProductBrand
        Color: ProductColor
        Size: ProductSize
    }
}

export interface ItemInScanArea {
    condition_id: number
    received_quantity: number
    product_id: number
}


const arrivalProductApi = {
    getArrivalProducts: async (arrival_number: string) => {
        const { data } = await axiosInstance.get(`/api/products/products-with-discrepancy/${arrival_number}`)
        return data.data
    },
    scanProduct: async (arrival_number: string, scanned_product: ItemInScanArea) => {
        const { data } = await axiosInstance.post(`/api/arrivals/scan/${arrival_number}`, scanned_product)
        return data.data
    }
}

export default arrivalProductApi
