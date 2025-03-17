import Logo from '@/components/mycomponents/Logo'
import { ModeToggle } from '@/components/mycomponents/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

// schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

// type
type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
    // state
    const [showPassword, setShowPassword] = useState(false)

    // hooks
    const { login, isLoggingIn, loginError } = useAuth()

    // form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    // submit
    const onSubmit = async (data: LoginFormData) => {
        try {
            login(data)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Login failed')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen relative">
            {/* logo */}
            <Logo />
            {/* mode toggle */}
            <ModeToggle className="absolute top-4 right-4" />
            {/* left  */}
            <div className="w-full md:w-1/2 h-full p-4 md:p-10 flex flex-col items-center justify-center">
                {/* title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Login</h1>
                {/* description */}
                <p className="text-sm text-gray-500 mb-4">Welcome back to the app</p>
                {/* login card */}
                <form
                    className="flex flex-col gap-3 w-full max-w-md md:w-2/4 border border-gray-300 rounded-lg p-4"
                    onSubmit={handleSubmit(onSubmit)}>
                    {/* login error */}
                    {loginError && (
                        <div className="text-sm text-red-500 mb-2">{loginError instanceof Error ? loginError.message : 'Login failed'}</div>
                    )}
                    {/* email */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            autoComplete="username"
                            {...register('email')}
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>
                    {/* password */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                    </div>
                    {/* login button */}
                    <Button
                        type="submit"
                        className="mt-4"
                        disabled={isLoggingIn}>
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                {/* register link */}
                <Link
                    to="/register"
                    className="text-xs text-gray-500 mt-3">
                    Don't have an account? Register
                </Link>
            </div>
            {/* right  */}
            <div className="w-1/2 h-full hidden md:block">
                <img
                    src="/pexels-chanaka-318741-906494.jpg"
                    alt="Login background"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

export default Login
