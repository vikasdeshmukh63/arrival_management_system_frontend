import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// chart data
const chartData = [
    { month: 'January', upcoming: 10, inProgress: 8, finished: 7, withDiscrepancy: 6 },
    { month: 'February', upcoming: 2, inProgress: 0, finished: 8, withDiscrepancy: 2 },
    { month: 'March', upcoming: 7, inProgress: 1, finished: 2, withDiscrepancy: 1 },
    { month: 'April', upcoming: 3, inProgress: 10, finished: 2, withDiscrepancy: 4 },
    { month: 'May', upcoming: 4, inProgress: 14, finished: 3, withDiscrepancy: 0 },
    { month: 'June', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'July', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'August', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'September', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'October', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'November', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 },
    { month: 'December', upcoming: 2, inProgress: 2, finished: 5, withDiscrepancy: 6 }
]

// chart config
const chartConfig = {
    upcoming: {
        label: 'Upcoming',
        color: '#FFA725'
    },
    inProgress: {
        label: 'In Progress',
        color: '#FFF5E4'
    },
    finished: {
        label: 'Finished',
        color: '#C1D8C3'
    },
    withDiscrepancy: {
        label: 'With Discrepancy',
        color: '#7A73D1'
    }
} satisfies ChartConfig

export function ArrivalChart({ title, description }: { title: string; description: string }) {
    return (
        <Card className="w-full h-full">
            {/* card header */}
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {/* card content */}
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        height={250}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="upcoming"
                            fill="#FFA725"
                            radius={4}
                        />
                        <Bar
                            dataKey="inProgress"
                            fill="#FFF5E4"
                            radius={4}
                        />
                        <Bar
                            dataKey="finished"
                            fill="#C1D8C3"
                            radius={4}
                        />
                        <Bar
                            dataKey="withDiscrepancy"
                            fill="#7A73D1"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
