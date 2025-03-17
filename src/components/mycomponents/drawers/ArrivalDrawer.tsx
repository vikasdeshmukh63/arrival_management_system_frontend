import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateArrival } from '@/lib/arrivals'
import ArrivalForm from '../ArrivalForm'
import ProductForm from '../ProductForm'
import { useState } from 'react'

const ArrivalDrawer = ({
    isOpen,
    onClose,
    data,
    setCreatedArrival,
    createdArrival
}: {
    isOpen: boolean
    onClose: () => void
    data?: (CreateArrival & { arrival_number: string }) | null
    setCreatedArrival: (arrival: (CreateArrival & { arrival_number: string }) | null) => void
    createdArrival: (CreateArrival & { arrival_number: string }) | null
}) => {
    // state
    const [selectedTab, setSelectedTab] = useState<'arrival' | 'products'>('arrival')

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onClose}>
            {/* sheet header */}
            <SheetHeader>
                <SheetTitle>Arrival</SheetTitle>
            </SheetHeader>
            {/* sheet content */}
            <SheetContent className="px-4">
                {/* tabs */}
                <Tabs
                    defaultValue={selectedTab}
                    value={selectedTab}
                    className="w-full mt-12">
                    {/* tabs list */}
                    <TabsList className="grid w-full grid-cols-2">
                        {/* arrival tab */}
                        <TabsTrigger
                            value="arrival"
                            onClick={() => setSelectedTab('arrival')}>
                            {data ? 'Update' : 'Add'} Arrival
                        </TabsTrigger>
                        {/* products tab */}
                        <TabsTrigger
                            value="products"
                            disabled={!createdArrival}
                            onClick={() => setSelectedTab('products')}>
                            {data ? 'Update' : 'Add'} Products
                        </TabsTrigger>
                    </TabsList>
                    {/* arrival tab content */}
                    <TabsContent value="arrival">
                        <ArrivalForm
                            data={data}
                            setSelectedTab={setSelectedTab}
                            onSuccess={setCreatedArrival}
                        />
                    </TabsContent>
                    {/* products tab content */}
                    <TabsContent value="products">
                        <ProductForm
                            arrivalId={createdArrival?.arrival_number}
                            data={data}
                        />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

export default ArrivalDrawer
