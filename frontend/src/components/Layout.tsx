import { Outlet, useLocation } from 'react-router-dom'
import CustomSidebar from './CustomSidebar'
import { Toaster } from 'sonner'

export default function Layout() {
    const location = useLocation();
    const isVerificationRoute = location.pathname === '/verification';

    return (
        <div className="flex min-h-screen bg-background">
            {!isVerificationRoute && <CustomSidebar />}
            <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 overflow-auto">
            <Outlet />
            </main>
            <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            MetaCitizen © {new Date().getFullYear()}
            </footer>
        </div>
        <Toaster position="top-right" />
        </div>
    )
} 