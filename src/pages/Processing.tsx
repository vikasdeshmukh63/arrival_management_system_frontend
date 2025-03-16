import PageHeader from '@/components/mycomponents/PageHeader'
import ProcessProductCard from '@/components/mycomponents/ProcessProductCard'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { useArrivalProducts } from '@/hooks/useArrivalProducts'
import { DetailedArrivalProduct } from '@/lib/arrivals'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Item {
    id: number
    value: string
}

const Processing = () => {
    const { arrival_number } = useParams()
    const [isScanning, setIsScanning] = useState(false)
    const [scannedItem, setScannedItem] = useState<string | null>(null)
    const [itemsToScan, setItemsToScan] = useState<Item[]>([
        { id: 1, value: '1' },
        { id: 2, value: '2' },
        { id: 3, value: '3' },
        { id: 4, value: '4' }
    ])
    const [itemInScanArea, setItemInScanArea] = useState<DetailedArrivalProduct | null>(null)
    const dragItem = useRef<HTMLDivElement>(null)
    const dragContainer = useRef<HTMLDivElement>(null)

    const { data } = useArrivalProducts(arrival_number as string)
    console.log(data)

    const handleScan = () => {
        if (!itemInScanArea) return

        setIsScanning(true)
        setTimeout(() => {
            setIsScanning(false)
            setScannedItem(itemInScanArea.value)
            setItemInScanArea(null)
        }, 5000)
    }

    const handleCancel = () => {
        if (isScanning) return
        setItemInScanArea(null)
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.5'
        }
        e.dataTransfer.setData('text/plain', JSON.stringify(item))
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1'
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = ''
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = ''
            const droppedData = e.dataTransfer.getData('text/plain')
            try {
                const item = JSON.parse(droppedData) as Item
                if (itemInScanArea) return // Only allow one item in scan area
                setItemInScanArea(item)
                setItemsToScan((prev) => prev.filter((i) => i.id !== item.id))
            } catch (error) {
                console.error('Invalid item data')
            }
        }
    }

    return (
        <Layout>
            <div className="flex flex-col min-h-full p-2">
                <PageHeader
                    title={`Processing ${arrival_number}`}
                    description="Processing the arrival"
                    actionLabel="Finish Processing"
                    onAction={() => {}}
                />

                <div className="flex flex-col lg:flex-row justify-between items-center h-[90vh] mt-4 gap-6">
                    {/* processed  */}
                    <div className="h-full rounded-lg p-4 w-full lg:w-5/12 shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
                        {data?.productsWithoutDiscrepancy.map((product: DetailedArrivalProduct) => {
                            return (
                                <ProcessProductCard
                                    key={product.arrival_product_id}
                                    product={product}
                                />
                            )
                        })}
                    </div>

                    {/* scan area  */}
                    <div
                        ref={dragContainer}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="h-full w-full lg:w-2/12 p-4 my-auto flex justify-center items-center flex-col gap-4">
                        <div
                            className="w-64 h-64 bg-gray-200 shadow-sm transition-all duration-200 flex flex-col items-center justify-center relative"
                            style={
                                isScanning
                                    ? {
                                          position: 'relative',
                                          overflow: 'hidden'
                                      }
                                    : {}
                            }>
                            {isScanning && (
                                <div
                                    className="absolute inset-0 z-10"
                                    style={{
                                        backgroundImage: `url('/Scanner.gif')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        opacity: 0.7
                                    }}
                                />
                            )}
                            {itemInScanArea && (
                                <Card className={`relative h-fit z-20 ${isScanning ? 'opacity-50' : ''}`}>
                                    <CardHeader className="mt-4">{itemInScanArea.Product.name}</CardHeader>
                                    <Badge
                                        variant="default"
                                        className="absolute top-2 right-2 font-bold">
                                        {itemInScanArea.Product.tsku}
                                    </Badge>
                                </Card>
                            )}
                        </div>
                        <div className="flex gap-2 w-full">
                            <Button
                                className="flex-1"
                                onClick={handleScan}
                                disabled={!itemInScanArea || isScanning}>
                                {isScanning ? 'Scanning...' : 'Scan'}
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleCancel}
                                disabled={!itemInScanArea || isScanning}>
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* products to scan  */}
                    <div className="h-full w-full lg:w-5/12 rounded-lg p-4 shadow-sm border border-gray-200 space-y-4 grid grid-cols-2 gap-4">
                        {data?.productsWithDiscrepancy.map((product: DetailedArrivalProduct) => (
                            <ProcessProductCard
                                key={product.arrival_product_id}
                                ref={product.arrival_product_id === 1 ? dragItem : undefined}
                                product={product}
                                right
                                onDragStart={(e) => handleDragStart(e, product)}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Processing
