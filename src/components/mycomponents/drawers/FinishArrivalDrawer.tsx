import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { EArrivalStatus } from '@/constants/constants'
import { FinishProcessingResponse } from '@/lib/arrivalProducts'
import { useNavigate } from 'react-router-dom'

const formatStatus = (status: string) => {
    const modifiedStatus = status.replace(/_/g, ' ')
    if (status === EArrivalStatus.NOT_INITIATED) return <span className="text-cyan-400 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.UPCOMING) return <span className="text-green-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.IN_PROGRESS) return <span className="text-yellow-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.COMPLETED_WITH_DISCREPANCY) return <span className="text-red-500 font-bold">{modifiedStatus}</span>
    if (status === EArrivalStatus.FINISHED) return <span className="text-blue-500 font-bold">{modifiedStatus}</span>
    return modifiedStatus
}

const FinishArrivalDrawer = ({ data, open, onClose }: { data: FinishProcessingResponse; open: boolean; onClose: () => void }) => {
    const navigate = useNavigate()
    return (
        <Sheet
            open={open}
            onOpenChange={onClose}>
            <SheetContent className="px-4">
                <SheetHeader>
                    <SheetTitle>Finish Arrival</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <p className="text-lg text-white">
                        <span className="font-bold">Arrival Number:</span> {data.arrival_number}
                    </p>
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">Status:</span> {formatStatus(data.status)}
                    </p>
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">Has Discrepancies:</span> {data.has_discrepancies ? 'Yes' : 'No'}
                    </p>
                    {data.has_discrepancies && (
                        <p className="text-lg text-gray-500">
                            <span className="font-bold">Discrepancies:</span>
                            <ul className="list-disc list-inside">
                                <li>Products: {data.discrepancies.products?.reduce((acc, curr) => acc + curr.difference, 0) || 0}</li>
                                <li>Boxes: {data.discrepancies.boxes?.difference || 0}</li>
                            </ul>
                        </p>
                    )}
                </div>
                <SheetFooter>
                    <Button
                        variant="default"
                        onClick={() => navigate('/arrivals')}>
                        Finish
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default FinishArrivalDrawer
