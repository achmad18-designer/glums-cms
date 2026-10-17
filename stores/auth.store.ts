import { create } from 'zustand';

type User = {
    id: string;
    username: string;
    email: string;
    role: string;
};

type AuthState = {
    accessToken: string | null;
    user: User | null;

    setAuth: (accessToken: string, user?: User) => void;
    setAccessToken: (accessToken: string) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,

    setAuth: (accessToken, user) =>
        set({
            accessToken,
            user: user ?? null,
        }),

    setAccessToken: (accessToken) => {
        console.log('accessToken set: ', accessToken)
        set({
            accessToken,
        })
    },

    clearAuth: () =>
        set({
            accessToken: null,
            user: null,
        }),
}));