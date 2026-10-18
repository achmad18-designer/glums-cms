"use client";

import { apiClient } from "@/lib/axios/client";
import { useAuthStore } from "@/stores/auth.store";
import { ApiResponse } from "@/types/api-response.type";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function logoutApi(): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
        "/api/v1/auth/logout",
    );

    return response.data;
}

export function useLogoutMutation() {
    const router = useRouter();
    const clearAuth = useAuthStore(
        (state) => state.clearAuth
    );

    return useMutation({
        mutationKey: ["auth", "logout"],
        mutationFn: () => logoutApi(),
        onSuccess: () => {
            clearAuth();
            router.push("/auth/login");
        },

        onError: (error) => {
            console.error("Logout failed:", getErrorMessage(error));
        },
    });
}