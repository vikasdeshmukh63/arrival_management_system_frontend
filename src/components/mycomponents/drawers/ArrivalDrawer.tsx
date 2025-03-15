import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateArrival } from '@/lib/arrivals'
import ArrivalForm from '../ArrivalForm'
import ProductForm from '../ProductForm'
import { useState } from 'react'

const ArrivalDrawer = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateArrival & { arrival_number: string }) | null
}) => {
    const [selectedTab, setSelectedTab] = useState<'arrival' | 'products'>('arrival')
    const [createdArrival, setCreatedArrival] = useState<(CreateArrival & { arrival_number: string }) | null>(null)

    const handleProductFormClose = () => {
        onClose()
        setCreatedArrival(null)
        setSelectedTab('arrival')
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onClose}>
            <SheetHeader>
                <SheetTitle>Arrival</SheetTitle>
            </SheetHeader>
            <SheetContent className="px-4">
                <Tabs
                    defaultValue={selectedTab}
                    value={selectedTab}
                    className="w-full mt-12">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="arrival"
                            onClick={() => setSelectedTab('arrival')}>
                            {data ? 'Update' : 'Add'} Arrival
                        </TabsTrigger>
                        <TabsTrigger
                            value="products"
                            disabled={!createdArrival}
                            onClick={() => setSelectedTab('products')}>
                            {data ? 'Update' : 'Add'} Products
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="arrival">
                        <ArrivalForm
                            data={data}
                            setSelectedTab={setSelectedTab}
                            onSuccess={setCreatedArrival}
                        />
                    </TabsContent>
                    <TabsContent value="products">
                        <ProductForm arrivalId={createdArrival?.arrival_number} />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

export default ArrivalDrawer
