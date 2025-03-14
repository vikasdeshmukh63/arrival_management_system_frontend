import { Loader } from 'lucide-react'
import React from 'react'

const LoaderComponent = () => {
    return (
        <div className="flex items-center justify-center w-full min-h-[60vh]">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default LoaderComponent
