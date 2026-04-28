"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,   // 5 minutes — don't refetch unless data is stale
                gcTime: 10 * 60 * 1000,     // 10 minutes — keep in cache
                retry: 1,
                refetchOnWindowFocus: false, // Don't refetch just because user switched tabs
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
