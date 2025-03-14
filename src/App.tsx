import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./provider/theme-provider";
import { PublicRoute } from "./components/mycomponents/wrappers/PublicRoute";
import { PrivateRoute } from "./components/mycomponents/wrappers/PrivateRoute";
import { Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Arrivals from "./pages/Arrivals";
import Products from "./pages/Products";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

function App() {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("No internet connection. Please check your network.");
    }
  }, [isOnline]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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

            {/* Catch all route - redirect to home */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
