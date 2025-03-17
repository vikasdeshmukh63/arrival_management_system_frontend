import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// custom auth error
export class AuthError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthError'
    }
}

// axios interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            throw new AuthError('Your session has expired or you are not authenticated')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
