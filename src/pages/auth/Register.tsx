import { ModeToggle } from '@/components/mycomponents/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '@/components/mycomponents/Logo'

const registerSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    })

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // TODO: Implement actual registration logic here
            console.log('Registration data:', data)
            toast.success('Registration successful')
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Registration failed')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen relative">
            <Logo />
            <img
                src="./logo.svg"
                alt=""
                className="absolute top-5 left-5"
            />
            <ModeToggle className="absolute top-4 right-4" />
            {/* left  */}
            <div className="w-full md:w-1/2 h-full p-4 md:p-10 flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Register</h1>
                <p className="text-sm text-gray-500 mb-4">Create your account</p>
                {/* register card */}
                <form
                    className="flex flex-col gap-3 w-full max-w-md md:w-2/4 border border-gray-300 rounded-lg p-4"
                    onSubmit={handleSubmit(onSubmit)}>
                    {/* name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            {...register('name')}
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>
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
                                autoComplete="new-password"
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
                    {/* confirm password */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                    </div>
                    {/* register button */}
                    <Button
                        type="submit"
                        className="mt-4">
                        Register
                    </Button>
                </form>
                {/* login link */}
                <Link
                    to="/login"
                    className="text-xs text-gray-500 mt-3">
                    Already have an account? Login
                </Link>
            </div>
            {/* right  */}
            <div className="w-1/2 h-full hidden md:block">
                <img
                    src="/pexels-chanaka-318741-906494.jpg"
                    alt="Register background"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

export default Register
