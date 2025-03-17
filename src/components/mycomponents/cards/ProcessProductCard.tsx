import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { DetailedArrivalProduct } from '@/lib/arrivalProducts'

const ProcessProductCard = ({
    product,
    right,
    ref,
    onDragStart,
    onDragEnd
}: {
    product: DetailedArrivalProduct
    right?: boolean
    ref?: React.RefObject<HTMLDivElement | null>
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
}) => {
    return (
        <div
            ref={ref}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}>
            <Card className="relative h-fit">
                {/* card header */}
                <CardHeader className="mt-4">{product.Product.name}</CardHeader>
                {/* card badge */}
                <Badge
                    variant="default"
                    className="absolute top-2 right-2 font-bold">
                    {product.Product.tsku}
                </Badge>
                {/* card footer */}
                <CardFooter className="flex justify-between items-center">
                    {/* quantity available */}
                    <Button
                        className="w-full"
                        variant={right ? 'destructive' : 'outline'}>
                        {right ? (
                            <p>Quantity Available: {product.expected_quantity - product.received_quantity}</p>
                        ) : (
                            <p>Quantity Expected: {product.expected_quantity}</p>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProcessProductCard
