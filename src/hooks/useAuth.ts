import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginCredentials, type RegisterCredentials } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const useAuth = () => {
    // navigate hook
    const navigate = useNavigate()

    // query client
    const queryClient = useQueryClient()

    // query
    const {
        data: user,
        isLoading: isLoadingUser,
        isError
    } = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getCurrentUser,
        retry: 0,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        throwOnError: false,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    })

    // login
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: async (data) => {
            queryClient.setQueryData(['user'], data.user)
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Logged in successfully')
            navigate('/dashboard', { replace: true })
        }
    })

    // register
    const registerMutation = useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
        onSuccess: async (data) => {
            queryClient.setQueryData(['user'], data.user)
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success('Registered successfully')
            navigate('/dashboard', { replace: true })
        }
    })

    // logout
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null)
            queryClient.invalidateQueries({ queryKey: ['user'] })
            navigate('/', { replace: true })
            toast.success('Logged out successfully')
        }
    })

    return {
        user,
        isLoadingUser,
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
