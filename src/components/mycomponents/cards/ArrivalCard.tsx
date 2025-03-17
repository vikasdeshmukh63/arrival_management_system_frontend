import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { EArrivalStatus } from '@/constants/constants'
import { Arrival, CreateArrival } from '@/lib/arrivals'
import { Product } from '@/lib/products'
import { Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../DeleteModal'

// format date
const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date))
}

// format status
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
    // state
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // navigate hook
    const navigate = useNavigate()

    // handle edit arrival
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

    // calculate progress, discrepancy and box discrepancy
    const { progress, discrepancy, boxDiscrepancy } = useMemo(() => {
        // if no products, return 0
        if (!arrival.Products || arrival.Products.length === 0) {
            return { progress: 0, discrepancy: 0, boxDiscrepancy: 0 }
        }

        let totalExpectedQuantity = 0
        let totalReceivedQuantity = 0

        // calculate total expected quantity and total received quantity
        arrival.Products.forEach((product) => {
            totalExpectedQuantity += product.ArrivalProduct.expected_quantity
            totalReceivedQuantity += product.ArrivalProduct.received_quantity
        })

        // if no expected quantity, return 0
        if (totalExpectedQuantity === 0) {
            return { progress: 0, discrepancy: 0, boxDiscrepancy: 0 }
        }

        // calculate progress, discrepancy and box discrepancy
        const calculatedProgress = Math.round((totalReceivedQuantity / totalExpectedQuantity) * 100)
        const calculatedDiscrepancy = totalReceivedQuantity - totalExpectedQuantity
        const calculatedBoxDiscrepancy = arrival.received_boxes - arrival.expected_boxes

        return {
            progress: calculatedProgress,
            discrepancy: calculatedDiscrepancy,
            boxDiscrepancy: calculatedBoxDiscrepancy
        }
    }, [arrival.Products, arrival.received_boxes, arrival.expected_boxes])

    // handle start processing
    const handleStartProcessing = () => {
        setArrivalToStartProcessing(arrival.arrival_number)
        setStartProcessingDrawerOpen(true)
    }

    return (
        <Card className="relative">
            {/* card header */}
            <CardHeader className="mt-2">{arrival.title}</CardHeader>
            {/* card content */}
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {/* supplier */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Supplier :</span> <br /> {arrival.Supplier.name}
                    </p>
                    {/* expected date */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Expected Date :</span> <br /> {formatDate(arrival.expected_date)}
                    </p>
                    {/* started date */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Started Date :</span> <br /> {formatDate(arrival.started_date)}
                    </p>
                    {/* finished date */}
                    <p className="text-sm text-gray-500">
                        <span className="font-bold">Finished Date :</span> <br />
                        {formatDate(arrival.finished_date)}
                    </p>
                    {/* status */}
                    <p className="text-sm text-gray-500 col-span-1">
                        <span className="font-bold">Status :</span>
                        <br />
                        <span>{formatStatus(arrival.status)}</span>
                    </p>
                    {/* items discrepancy */}
                    {arrival.status === EArrivalStatus.COMPLETED_WITH_DISCREPANCY && (
                        <div className="text-sm text-gray-500 col-span-1 flex flex-col gap-2">
                            {/* items discrepancy */}
                            <span>
                                <span className="font-bold">Items Discrepancy:</span> <br />
                                {discrepancy > 0 ? `+${discrepancy} (excess)` : `${discrepancy} (missing)`} items
                            </span>
                            {/* boxes discrepancy */}
                            <span>
                                <span className="font-bold">Boxes Discrepancy:</span> <br />
                                {boxDiscrepancy > 0 ? `+${boxDiscrepancy} (excess)` : `${boxDiscrepancy} (missing)`} boxes
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            {/* card footer */}
            <Badge
                variant="default"
                className="absolute top-2 right-2 font-bold">
                {arrival.arrival_number}
            </Badge>
            {/* card footer */}
            <CardFooter className="flex justify-between items-center gap-2 flex-col md:flex-row">
                {(arrival.status === EArrivalStatus.UPCOMING || arrival.status === EArrivalStatus.NOT_INITIATED) && (
                    <Button
                        variant="outline"
                        className="w-full md:w-fit"
                        onClick={handleEditArrival}>
                        Edit
                    </Button>
                )}
                {/* start processing */}
                {arrival.status === EArrivalStatus.UPCOMING && (
                    <div
                        className="w-full"
                        onClick={handleStartProcessing}>
                        <Button className="w-full">Start Processing</Button>
                    </div>
                )}
                {/* in progress */}
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
                {/* delete */}
                <Button
                    variant="destructive"
                    className="w-full md:w-fit ml-auto"
                    onClick={() => setOpenDeleteModal(true)}>
                    Delete
                </Button>
                {/* info */}
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="outline"
                            className="w-fit">
                            <Info className="w-4 h-4 text-gray-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {/* expected pallets */}
                        <p>
                            <span className="font-bold">expected pallets : </span>
                            {arrival.expected_pallets || 0}
                        </p>
                        {/* expected boxes */}
                        <p>
                            <span className="font-bold">expected boxes : </span>
                            {arrival.expected_boxes || 0}
                        </p>
                        {/* expected pieces */}
                        <p>
                            <span className="font-bold">expected pieces : </span>
                            {arrival.expected_pieces || 0}
                        </p>
                        {/* expected kilograms */}
                        <p>
                            <span className="font-bold">expected kilograms : </span>
                            {arrival.expected_kilograms || 0}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </CardFooter>

            {/* delete modal */}
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
