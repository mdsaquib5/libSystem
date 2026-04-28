"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function AuthGuard({ children }) {
    const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isCheckingAuth) {
            if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
                router.push('/login');
            } else if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isCheckingAuth, pathname, router]);

    if (isCheckingAuth) {
        return (
            <div className="auth-container">
                <div className="spinner"></div>
            </div>
        );
    }

    // Only render children if authenticated, or if we're on public pages
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
        return null;
    }

    return children;
}
