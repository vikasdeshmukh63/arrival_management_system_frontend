import { DetailedArrivalProduct } from '@/lib/arrivalProducts'
import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader } from '../ui/card'

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
                <CardHeader className="mt-4">{product.Product.name}</CardHeader>
                <Badge
                    variant="default"
                    className="absolute top-2 right-2 font-bold">
                    {product.Product.tsku}
                </Badge>
                <CardFooter className="flex justify-between items-center">
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
