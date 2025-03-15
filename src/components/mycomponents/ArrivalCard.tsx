import { Product } from '@/lib/products'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { useMemo, useState } from 'react'
import DeleteModal from './DeleteModal'
import { Arrival } from '@/lib/arrivals'
import { EArrivalStatus } from '@/constants/constants'
import { Progress } from '../ui/progress'

const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date))
}

const formatStatus = (status: string) => {
    const modifiedStatus = status.replace(/_/g, ' ')
    if (status === EArrivalStatus.NOT_INITIATED) return <span className="text-cyan-400 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.UPCOMING) return <span className="text-green-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.IN_PROGRESS) return <span className="text-yellow-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.COMPLETED_WITH_DISCREPANCY) return <span className="text-red-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.FINISHED) return <span className="text-blue-500 font-bold">{modifiedStatus}</span>
    return modifiedStatus
}

const ArrivalCard = ({ arrival, handleOpenEditDrawer }: { arrival: Arrival; handleOpenEditDrawer: (arrival: Arrival) => void }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const { progress, discrepancy } = useMemo(() => {
        if (!arrival.Products || arrival.Products.length === 0) {
            return { progress: 0, discrepancy: 0 }
        }

        let totalExpectedQuantity = 0
        let totalReceivedQuantity = 0

        arrival.Products.forEach((product) => {
            totalExpectedQuantity += product.ArrivalProduct.expected_quantity
            totalReceivedQuantity += product.ArrivalProduct.received_quantity
        })

        if (totalExpectedQuantity === 0) {
            return { progress: 0, discrepancy: 0 }
        }

        const calculatedProgress = Math.round((totalReceivedQuantity / totalExpectedQuantity) * 100)
        const calculatedDiscrepancy = totalReceivedQuantity - totalExpectedQuantity

        return {
            progress: calculatedProgress,
            discrepancy: calculatedDiscrepancy
        }
    }, [arrival.Products])

    return (
        <Card className="relative">
            <CardHeader className="mt-2">{arrival.title}</CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Supplier :</span> <br /> {arrival.Supplier.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Expected Date :</span> <br /> {formatDate(arrival.expected_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Started Date :</span> <br /> {formatDate(arrival.started_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Finished Date :</span> <br />
                        {formatDate(arrival.finished_date)}
                    </p>
                    <p className="text-sm text-gray-500 col-span-1">
                        <span className="font-bold">Status :</span>
                        <br />
                        <span>{formatStatus(arrival.status)}</span>
                    </p>
                    {arrival.status === EArrivalStatus.COMPLETED_WITH_DISCREPANCY && (
                        <span className="text-sm text-gray-500 col-span-1">
                            <span className="font-bold">Discrepancy :</span> <br />
                            {discrepancy > 0 ? `+${discrepancy} (excess)` : `${discrepancy} (missing)`} items
                        </span>
                    )}
                </div>
            </CardContent>
            <Badge
                variant="default"
                className="absolute top-2 right-2 font-bold">
                {arrival.arrival_number}
            </Badge>
            <CardFooter className="flex justify-between items-center gap-2 flex-col md:flex-row">
                {(arrival.status === EArrivalStatus.UPCOMING || arrival.status === EArrivalStatus.NOT_INITIATED) && (
                    <Button
                        variant="outline"
                        className="w-full md:w-fit"
                        onClick={() => handleOpenEditDrawer(arrival)}>
                        Edit
                    </Button>
                )}

                {arrival.status === EArrivalStatus.IN_PROGRESS && (
                    <div
                        className="flex justify-center items-center w-full gap-2"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        {isHovered ? (
                            <Button
                                variant="default"
                                className="w-full">
                                Continue Processing
                            </Button>
                        ) : (
                            <>
                                <Progress
                                    value={progress}
                                    className="w-5/6"
                                />
                                <p className="text-sm text-gray-500">{progress}%</p>
                            </>
                        )}
                    </div>
                )}
                <Button
                    variant="destructive"
                    className="w-full md:w-fit ml-auto"
                    onClick={() => setOpenDeleteModal(true)}>
                    Delete
                </Button>
            </CardFooter>

            {/* Delete Modal */}
            {openDeleteModal && (
                <DeleteModal
                    open={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    type="arrival"
                    id={arrival.arrival_number}
                />
            )}
        </Card>
    )
}

export default ArrivalCard
