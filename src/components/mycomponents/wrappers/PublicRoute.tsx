import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface PublicRouteProps {
    children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    // hooks
    const { isAuthenticated, isLoadingUser } = useAuth()

    // during initial load, render children to prevent flash of loading
    if (isLoadingUser) {
        return null
    }

    // if user is authenticated then redirect to dashboard
    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        )
    }

    // if user is not authenticated or on home page, show the requested route
    return <>{children}</>
}
