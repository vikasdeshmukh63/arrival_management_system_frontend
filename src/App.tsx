import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './provider/theme-provider'
import { PublicRoute } from './components/mycomponents/wrappers/PublicRoute'
import { PrivateRoute } from './components/mycomponents/wrappers/PrivateRoute'
import { Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Arrivals from './pages/Arrivals'
import Products from './pages/Products'
import useNetworkStatus from './hooks/useNetworkStatus'
import { useEffect } from 'react'
import { toast } from 'sonner'
import Brands from './pages/Brands'
import Categories from './pages/Categories'
import Colors from './pages/Colors'
import Conditions from './pages/Conditions'
import Sizes from './pages/Sizes'
import Styles from './pages/Styles'
import Suppliers from './pages/Suppliers'
const queryClient = new QueryClient()

function App() {
    const isOnline = useNetworkStatus()

    useEffect(() => {
        if (!isOnline) {
            toast.error('No internet connection. Please check your network.')
        }
    }, [isOnline])

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    defaultTheme="dark"
                    storageKey="vite-ui-theme">
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <Home />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/arrivals"
                            element={
                                <PrivateRoute>
                                    <Arrivals />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/products"
                            element={
                                <PrivateRoute>
                                    <Products />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/brands"
                            element={
                                <PrivateRoute>
                                    <Brands />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/categories"
                            element={
                                <PrivateRoute>
                                    <Categories />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/colors"
                            element={
                                <PrivateRoute>
                                    <Colors />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/conditions"
                            element={
                                <PrivateRoute>
                                    <Conditions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/sizes"
                            element={
                                <PrivateRoute>
                                    <Sizes />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/styles"
                            element={
                                <PrivateRoute>
                                    <Styles />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/suppliers"
                            element={
                                <PrivateRoute>
                                    <Suppliers />
                                </PrivateRoute>
                            }
                        />
                        {/* Catch all route - redirect to home */}
                        <Route
                            path="*"
                            element={
                                <PrivateRoute>
                                    <Navigate
                                        to="/dashboard"
                                        replace
                                    />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                    <Toaster />
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default App
