import type {
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

import { apiClient } from './client';
import { useAuthStore } from '@/stores/auth.store';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await apiClient.get('/api/v1/auth/token');

        const accessToken = response.data?.data?.accessToken;

        console.log(accessToken, ": refreshAccessToken");
        if (!accessToken) {
            return null;
        }


        useAuthStore.getState().setAccessToken(accessToken);

        return accessToken;
    } catch {
        useAuthStore.getState().clearAuth();

        return null;
    }
};

export const setupAxiosInterceptors = () => {
    apiClient.interceptors.request.use(
        (config) => {
            const accessToken = useAuthStore.getState().accessToken;

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error),
    );

    apiClient.interceptors.response.use(
        (response) => response,

        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequestConfig;

            if (
                error.response?.status !== 401 ||
                originalRequest?._retry
            ) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                console.log("refreshAccessToken, aaa");
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }

            const accessToken = await refreshPromise;

            if (!accessToken) {
                return Promise.reject(error);
            }

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return apiClient(originalRequest);
        },
    );
};