import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface PrivateRouteProps {
    children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isLoadingUser } = useAuth()
    const location = useLocation()

    // While checking authentication status, show nothing
    if (isLoadingUser) {
        return null
    }

    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        // Save the attempted URL for redirecting after login
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    // If user is authenticated, show the requested route
    return <>{children}</>
}
