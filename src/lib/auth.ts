import axiosInstance from './axios-instance'

// types
export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
    name: string
}

export interface User {
    id: string
    email: string
    name: string
}

export interface AuthResponse {
    user: User
}

// auth api
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>('/api/auth/login', credentials)
        return data
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>('/api/auth/register', credentials)
        return data
    },

    logout: async () => {
        await axiosInstance.post('/api/auth/logout')
    },

    getCurrentUser: async (): Promise<User> => {
        const { data } = await axiosInstance.get<User>('/api/auth/me')
        return data
    }
}
