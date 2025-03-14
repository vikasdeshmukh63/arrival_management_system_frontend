import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoadingUser } = useAuth();
  console.log(isAuthenticated,isLoadingUser)

  // During initial load, render children to prevent flash of loading
  if (isLoadingUser) {
    return null;
  }

  // If user is authenticated then redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated or on home page, show the requested route
  return <>{children}</>;
}; 