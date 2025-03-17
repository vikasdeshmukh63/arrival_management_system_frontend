import { ArrivalChart } from '@/components/mycomponents/ArrivalChart'
import CountCards from '@/components/mycomponents/cards/CountCards'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { useCounts } from '@/hooks/useCounts'
import { CircleSlash2, Loader, Package, PackageSearch, Truck, Users2 } from 'lucide-react'

// cards
const cards = (
    totalArrivals: number,
    inProgressArrivals: number,
    finishedArrivals: number,
    finishedWithDiscrepancy: number,
    totalSuppliers: number,
    totalProducts: number
) => {
    return [
        {
            icon: <Truck className="h-4 w-4 text-muted-foreground" />,
            title: 'Total Arrivals',
            count: totalArrivals,
            percentage: 12
        },
        {
            icon: <Loader className="h-4 w-4 text-muted-foreground" />,
            title: 'In-Progress Arrivals',
            count: inProgressArrivals,
            percentage: 12
        },
        {
            icon: <Package className="h-4 w-4 text-muted-foreground" />,
            title: 'Finished Arrivals',
            count: finishedArrivals,
            percentage: 12
        },
        {
            icon: <CircleSlash2 className="h-4 w-4 text-muted-foreground" />,
            title: 'Finished with Discrepancy',
            count: finishedWithDiscrepancy,
            percentage: 12
        },
        {
            icon: <Users2 className="h-4 w-4 text-muted-foreground" />,
            title: 'Total Suppliers',
            count: totalSuppliers,
            percentage: 12
        },
        {
            icon: <PackageSearch className="h-4 w-4 text-muted-foreground" />,
            title: 'Total Products',
            count: totalProducts,
            percentage: 12
        }
    ]
}

const Dashboard = () => {
    // hooks
    const { arrivalCounts, entitiesCount, isLoading } = useCounts()

    // loading state
    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center w-full h-full">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            </Layout>
        )
    }

    // cards
    const cardItems = cards(
        arrivalCounts?.total ?? 0,
        arrivalCounts?.in_progress ?? 0,
        arrivalCounts?.finished ?? 0,
        arrivalCounts?.with_discrepancy ?? 0,
        entitiesCount?.suppliers ?? 0,
        entitiesCount?.products ?? 0
    )

    return (
        <Layout>
            <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full max-w-[2000px] mx-auto">
                {/* page header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500">Welcome to your logistics dashboard</p>
                </div>
                {/* cards  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4">
                    {cardItems.map((card) => (
                        <CountCards
                            key={card.title}
                            {...card}
                        />
                    ))}
                </div>
                {/* arrival chart */}
                <div className="w-full">
                    <ArrivalChart
                        title="Arrivals"
                        description="Arrivals"
                    />
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
