import { Card, CardContent, CardHeader } from '@/components/ui/card'

const CountCards = ({ icon, title, count, percentage }: { icon: React.ReactNode; title: string; count: number; percentage: number }) => {
    return (
        <Card className="w-full">
            {/* card header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="font-semibold text-sm text-muted-foreground">{title}</div>
                {icon}
            </CardHeader>
            {/* card content */}
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{percentage}% from last month</p>
            </CardContent>
        </Card>
    )
}

export default CountCards
