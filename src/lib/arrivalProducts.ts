import { ProductBrand, ProductCat, ProductColor, ProductSize, ProductStyle } from '@/lib/products'
import axiosInstance from './axios-instance'

// types
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

export interface ProductDiscrepancy {
    product_id: number
    product_name: string
    product_sku: string
    expected_quantity: number
    received_quantity: number
    difference: number
}

export interface BoxDiscrepancy {
    expected_boxes: number
    received_boxes: number
    difference: number
}

export interface FinishProcessingResponse {
    arrival_number: string
    status: string
    has_discrepancies: boolean
    discrepancies: {
        products: ProductDiscrepancy[] | null
        boxes: BoxDiscrepancy | null
    }
}

// arrival product api
const arrivalProductApi = {
    getArrivalProducts: async (arrival_number: string) => {
        const { data } = await axiosInstance.get(`/api/products/products-with-discrepancy/${arrival_number}`)
        return data.data
    },
    scanProduct: async (arrival_number: string, scanned_product: ItemInScanArea) => {
        const { data } = await axiosInstance.post(`/api/arrivals/scan/${arrival_number}`, scanned_product)
        return data.data
    },
    finishProcessing: async (arrival_number: string) => {
        const { data } = await axiosInstance.post(`/api/arrivals/finish-processing/${arrival_number}`)
        return data.data
    }
}

export default arrivalProductApi
