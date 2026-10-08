'use client';

import { useEffect } from 'react';
import { setupAxiosInterceptors } from '@/lib/axios/interceptor';

type AxiosProviderProps = {
    children: React.ReactNode;
};

export default function AxiosProvider({
    children,
}: AxiosProviderProps) {
    useEffect(() => {
        setupAxiosInterceptors();
    }, []);

    return children;
}