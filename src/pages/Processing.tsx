import FinishArrivalDrawer from '@/components/mycomponents/drawers/FinishArrivalDrawer'
import PageHeader from '@/components/mycomponents/PageHeader'
import ProcessProductCard from '@/components/mycomponents/cards/ProcessProductCard'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { useArrivalProducts } from '@/hooks/useArrivalProducts'
import { DetailedArrivalProduct, FinishProcessingResponse } from '@/lib/arrivalProducts'
import { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { useArrival } from '@/hooks/useArrivals'
import { EArrivalStatus } from '@/constants/constants'

const Processing = () => {
    // params
    const { arrival_number } = useParams()
    // navigation hook
    const navigate = useNavigate()

    // state
    const [itemInScanArea, setItemInScanArea] = useState<DetailedArrivalProduct | null>(null)
    const [finishArrivalData, setFinishArrivalData] = useState<FinishProcessingResponse | null>(null)
    const [openFinishArrivalDrawer, setOpenFinishArrivalDrawer] = useState(false)
    const dragItem = useRef<HTMLDivElement>(null)
    const dragContainer = useRef<HTMLDivElement>(null)

    // hooks
    const { data, isLoading, scanProduct, isScanning, isScanningError, finishProcessing, isFinishingProcessingError } = useArrivalProducts(
        arrival_number as string
    )
    const { arrival, isLoading: isArrivalLoading } = useArrival(arrival_number as string)

    // navigate to arrivals page if arrival is not in progress
    useEffect(() => {
        if (arrival && !isArrivalLoading && arrival.status !== EArrivalStatus.IN_PROGRESS) {
            navigate('/arrivals')
        }
    }, [arrival, isArrivalLoading, navigate])

    // handle scan
    const handleScan = () => {
        // if no item in scan area, return
        if (!itemInScanArea) return

        // scan product
        scanProduct({
            scanned_product: {
                condition_id: itemInScanArea.condition_id,
                received_quantity: 1,
                product_id: itemInScanArea.product_id
            }
        })

        // if not scanning, set item in scan area to null
        if (!isScanning) {
            setItemInScanArea(null)
        }
    }

    // handle cancel scan
    const handleCancel = () => {
        if (isScanning) return
        setItemInScanArea(null)
    }

    // handle drag start
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DetailedArrivalProduct) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.5'
        }
        e.dataTransfer.setData('text/plain', JSON.stringify(item))
    }

    // handle drag end
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1'
        }
    }

    // handle drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        }
    }

    // handle drag leave
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = ''
        }
    }

    // handle drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = ''
            const droppedData = e.dataTransfer.getData('text/plain')
            try {
                const item = JSON.parse(droppedData) as DetailedArrivalProduct
                if (itemInScanArea) return // only allow one item in scan area
                setItemInScanArea(item)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Error dropping product')
            }
        }
    }

    // when all products are scanned, finish processing and open finish arrival drawer
    useEffect(() => {
        if (data?.productsWithDiscrepancy.length === 0) {
            finishProcessing()
                .then((data) => {
                    setFinishArrivalData(data)
                })
                .then(() => {
                    setOpenFinishArrivalDrawer(true)
                })
        }
    }, [data?.productsWithDiscrepancy.length, finishProcessing])

    // handle finish arrival
    const handleFinishArrival = () => {
        finishProcessing()
            .then((data) => {
                setFinishArrivalData(data)
            })
            .then(() => {
                setOpenFinishArrivalDrawer(true)
            })
    }

    return (
        <Layout>
            <div className="flex flex-col min-h-full p-2">
                {/* page header */}
                <PageHeader
                    title={`Processing ${arrival_number}`}
                    description="Processing the arrival"
                    actionLabel="Finish Processing"
                    onAction={handleFinishArrival}
                />

                {/* main content */}
                <div className="flex flex-col lg:flex-row justify-between items-center h-[90vh] mt-4 gap-6">
                    {/* processed items  */}
                    <div className="h-full rounded-lg p-4 w-full lg:w-5/12 shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
                        {/* loading state */}
                        {isLoading ? (
                            <div className="col-span-2 h-full flex items-center justify-center">
                                <Loader className="animate-spin" />
                            </div>
                        ) : (
                            // processed items
                            data?.productsWithoutDiscrepancy.map((product: DetailedArrivalProduct) => {
                                return (
                                    <ProcessProductCard
                                        key={product.arrival_product_id}
                                        product={product}
                                    />
                                )
                            })
                        )}
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
                            {/* item in scan area */}
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
                        {/* action buttons */}
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
                        {/* error messages */}
                        {isScanningError && isScanningError instanceof AxiosError && (
                            <p className="text-red-500">{isScanningError.response?.data.message || 'Error scanning product'}</p>
                        )}
                        {isFinishingProcessingError && isFinishingProcessingError instanceof AxiosError && (
                            <p className="text-red-500">{isFinishingProcessingError.response?.data.message || 'Error scanning product'}</p>
                        )}
                    </div>

                    {/* products to scan  */}
                    <div className="h-full w-full lg:w-5/12 rounded-lg p-4 shadow-sm border border-gray-200 space-y-4 grid grid-cols-2 gap-4">
                        {/* loading state */}
                        {isLoading ? (
                            <div className="col-span-2 h-full flex items-center justify-center">
                                <Loader className="animate-spin" />
                            </div>
                        ) : (
                            // products to scan
                            data?.productsWithDiscrepancy.map((product: DetailedArrivalProduct) => (
                                <ProcessProductCard
                                    key={product.arrival_product_id}
                                    ref={product.arrival_product_id === 1 ? dragItem : undefined}
                                    product={product}
                                    right
                                    onDragStart={(e) => handleDragStart(e, product)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* finish arrival drawer */}
                {finishArrivalData && openFinishArrivalDrawer && (
                    <FinishArrivalDrawer
                        data={finishArrivalData}
                        open={openFinishArrivalDrawer}
                        onClose={() => setOpenFinishArrivalDrawer(false)}
                    />
                )}
            </div>
        </Layout>
    )
}

export default Processing
