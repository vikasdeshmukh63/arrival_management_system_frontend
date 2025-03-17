import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface PrivateRouteProps {
    children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    // hooks
    const { isAuthenticated, isLoadingUser } = useAuth()
    const location = useLocation()

    // while checking authentication status, show nothing
    if (isLoadingUser) {
        return null
    }

    // if user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        // save the attempted URL for redirecting after login
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    // if user is authenticated, show the requested route
    return <>{children}</>
}
