import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { EArrivalStatus } from '@/constants/constants'
import { Arrival, CreateArrival } from '@/lib/arrivals'
import { Product } from '@/lib/products'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../DeleteModal'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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

const ArrivalCard = ({
    arrival,
    handleOpenEditDrawer,
    setCreatedArrival,
    setArrivalToStartProcessing,
    setStartProcessingDrawerOpen
}: {
    arrival: Arrival
    handleOpenEditDrawer: (arrival: Arrival) => void
    setCreatedArrival: (arrival: (CreateArrival & { arrival_number: string }) | null) => void
    setArrivalToStartProcessing: (arrival_number: string) => void
    setStartProcessingDrawerOpen: (open: boolean) => void
}) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const navigate = useNavigate()

    const handleEditArrival = () => {
        const arrivalToEdit: CreateArrival & { arrival_number: string } = {
            title: arrival.title,
            supplier_id: arrival.Supplier.supplier_id,
            expected_boxes: arrival.expected_boxes,
            expected_kilograms: arrival.expected_kilograms,
            expected_pieces: arrival.expected_pieces,
            expected_pallets: arrival.expected_pallets,
            expected_date: new Date(arrival.expected_date),
            notes: arrival.notes,
            arrival_number: arrival.arrival_number,
            arrival_products: arrival.Products.map((p) => ({
                product_id: (p as unknown as Product).product_id,
                expected_quantity: p.ArrivalProduct.expected_quantity,
                condition_id: p.ArrivalProduct.condition_id
            }))
        }
        setCreatedArrival(arrivalToEdit)
        handleOpenEditDrawer(arrival)
    }

    const { progress, discrepancy, boxDiscrepancy } = useMemo(() => {
        if (!arrival.Products || arrival.Products.length === 0) {
            return { progress: 0, discrepancy: 0, boxDiscrepancy: 0 }
        }

        let totalExpectedQuantity = 0
        let totalReceivedQuantity = 0

        arrival.Products.forEach((product) => {
            totalExpectedQuantity += product.ArrivalProduct.expected_quantity
            totalReceivedQuantity += product.ArrivalProduct.received_quantity
        })

        if (totalExpectedQuantity === 0) {
            return { progress: 0, discrepancy: 0, boxDiscrepancy: 0 }
        }

        const calculatedProgress = Math.round((totalReceivedQuantity / totalExpectedQuantity) * 100)
        const calculatedDiscrepancy = totalReceivedQuantity - totalExpectedQuantity
        const calculatedBoxDiscrepancy = arrival.received_boxes - arrival.expected_boxes

        return {
            progress: calculatedProgress,
            discrepancy: calculatedDiscrepancy,
            boxDiscrepancy: calculatedBoxDiscrepancy
        }
    }, [arrival.Products, arrival.received_boxes, arrival.expected_boxes])

    const handleStartProcessing = () => {
        setArrivalToStartProcessing(arrival.arrival_number)
        setStartProcessingDrawerOpen(true)
    }

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
                        <div className="text-sm text-gray-500 col-span-1 flex flex-col gap-2">
                            <span>
                                <span className="font-bold">Items Discrepancy:</span> <br />
                                {discrepancy > 0 ? `+${discrepancy} (excess)` : `${discrepancy} (missing)`} items
                            </span>
                            <span>
                                <span className="font-bold">Boxes Discrepancy:</span> <br />
                                {boxDiscrepancy > 0 ? `+${boxDiscrepancy} (excess)` : `${boxDiscrepancy} (missing)`} boxes
                            </span>
                        </div>
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
                        onClick={handleEditArrival}>
                        Edit
                    </Button>
                )}

                {arrival.status === EArrivalStatus.UPCOMING && (
                    <div
                        className="w-full"
                        onClick={handleStartProcessing}>
                        <Button className="w-full">Start Processing</Button>
                    </div>
                )}

                {arrival.status === EArrivalStatus.IN_PROGRESS && (
                    <div
                        className="flex justify-center items-center w-full gap-2"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        {isHovered ? (
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={() => navigate(`/arrivals/processing/${arrival.arrival_number}`)}>
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
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="outline"
                            className="w-fit">
                            <Info className="w-4 h-4 text-gray-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            <span className="font-bold">expected pallets : </span>
                            {arrival.expected_pallets || 0}
                        </p>
                        <p>
                            <span className="font-bold">expected boxes : </span>
                            {arrival.expected_boxes || 0}
                        </p>
                        <p>
                            <span className="font-bold">expected pieces : </span>
                            {arrival.expected_pieces || 0}
                        </p>
                        <p>
                            <span className="font-bold">expected kilograms : </span>
                            {arrival.expected_kilograms || 0}
                        </p>
                    </TooltipContent>
                </Tooltip>
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
