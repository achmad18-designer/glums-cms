
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import axios from "axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useCreateServiceMutation() {
    const notification = useAppNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post<ApiResponse<ServiceType>>(
                "/api/v1/services",
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            // Refresh cache daftar project setelah berhasil membuat project.
            await queryClient.invalidateQueries({
                queryKey: ["services"],
            });
        },

        onError: (error) => {
            console.error("Create Service error:", error);
            notification.error({
                title: "Failed to create Service",
                description: getErrorMessage(error),
            });
        },
    });
}
