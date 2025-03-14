import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Remove /api since it's part of your routes
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// Create a custom error type for authentication errors
export class AuthError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthError'
    }
}

// We don't need the request interceptor for token anymore since we're using cookies
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Instead of redirecting, throw a custom auth error
            // Components can catch this and handle it appropriately
            throw new AuthError('Your session has expired or you are not authenticated')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
