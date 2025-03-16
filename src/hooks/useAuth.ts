import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginCredentials, type RegisterCredentials } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const useAuth = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Query for getting the current user
    const {
        data: user,
        isLoading: isLoadingUser,
        isError
    } = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getCurrentUser,
        retry: 0, // Don't retry on failure
        retryOnMount: false, // Don't retry when component mounts
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        // Don't throw errors for 401s since that just means the user isn't logged in
        throwOnError: false,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        gcTime: 1000 * 60 * 10 // Keep data in cache for 10 minutes
    })

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: async (data) => {
            // Update the user query data
            queryClient.setQueryData(['user'], data.user)
            // Invalidate and refetch to ensure we have fresh data
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Logged in successfully')
            // Navigate after state is updated
            navigate('/dashboard', { replace: true })
        }
    })

    const registerMutation = useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
        onSuccess: async (data) => {
            // Update the user query data
            queryClient.setQueryData(['user'], data.user)
            // Invalidate and refetch to ensure we have fresh data
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Registered successfully')
            // Navigate after state is updated
            navigate('/dashboard', { replace: true })
        }
    })

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            // Clear the user query data
            queryClient.setQueryData(['user'], null)
            // Invalidate the query to ensure clean state
            queryClient.invalidateQueries({ queryKey: ['user'] })
            // Redirect to home page after logout
            navigate('/', { replace: true })
            toast.success('Logged out successfully')
        }
    })

    return {
        user,
        isLoadingUser,
        // Consider authenticated only if we have user data and no error
        isAuthenticated: !!user && !isError,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending
    }
}
