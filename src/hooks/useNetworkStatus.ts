import { useState, useEffect } from 'react'

function useNetworkStatus() {
    // state
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    // use effect
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return isOnline
}

export default useNetworkStatus
