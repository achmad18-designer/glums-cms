"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginResponse, LoginType } from "../types/login.type";
import { useAuthStore } from "@/stores/auth.store";

async function loginApi(
    payload: LoginType
): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/api/v1/auth/login",
        payload
    );

    return response.data;
}

export function useLoginMutation() {
    const setAccessToken = useAuthStore(
        (state) => state.setAccessToken
    );
    return useMutation({
        mutationKey: ["auth", "login"],

        mutationFn: (payload: LoginType) => loginApi(payload),

        onSuccess: (response) => {
            console.log("Login successful:", response.data);
            setAccessToken(response.data.accessToken);
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Login failed:",
                    error.response?.data?.message || error.message
                );
                return;
            }

            console.error("Login failed:", error);
        },
    });
}