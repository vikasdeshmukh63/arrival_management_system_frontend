import { Info } from 'lucide-react'
import React from 'react'

const NoData = ({ item }: { item: string }) => {
    return (
        <div className="flex items-center justify-center w-full min-h-[60vh] gap-2">
            <Info className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No {item} found</p>
        </div>
    )
}

export default NoData
