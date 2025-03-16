import Layout from '@/components/mycomponents/wrappers/Layout'
import { useAuth } from '@/hooks/useAuth'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'

const Logout = () => {
    const { logout } = useAuth()

    useEffect(() => {
        logout()
    }, [logout])

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader className="animate-spin" />
                <p className="mt-4 text-muted-foreground text-2xl font-bold">Logging out...</p>
            </div>
        </Layout>
    )
}

export default Logout
