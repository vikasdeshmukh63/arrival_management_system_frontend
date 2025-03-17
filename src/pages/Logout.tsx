import Layout from '@/components/mycomponents/wrappers/Layout'
import { useAuth } from '@/hooks/useAuth'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'

const Logout = () => {
    // hooks
    const { logout } = useAuth()

    // logout
    useEffect(() => {
        logout()
    }, [logout])

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                {/* loader */}
                <Loader className="animate-spin" />
                {/* text */}
                <p className="mt-4 text-muted-foreground text-2xl font-bold">Logging out...</p>
            </div>
        </Layout>
    )
}

export default Logout
