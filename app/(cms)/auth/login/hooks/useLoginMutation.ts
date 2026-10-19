"use client";

import { authClient } from "@/lib/axios/client";
import { useAuthStore } from "@/stores/auth.store";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse, LoginType } from "../types/login.type";

export function useLoginMutation() {
    const setAccessToken = useAuthStore(
        (state) => state.setAccessToken
    );
    return useMutation({
        mutationKey: ["auth", "login"],

        mutationFn: async (payload: LoginType) => {
            const response = await authClient.post<ApiResponse<LoginResponse>>(
                "/api/v1/auth/login",
                payload
            );
            return response.data;
        },

        onSuccess: (response) => {
            setAccessToken(response.data.accessToken);
        }
    });
}