
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubServiceType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useCreateSubServiceMutation() {
    const notification = useAppNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post<ApiResponse<SubServiceType>>(
                "/api/v1/sub-services",
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            // Refresh cache daftar project setelah berhasil membuat project.
            await queryClient.invalidateQueries({
                queryKey: ["sub-services"],
            });
        },

        onError: (error) => {
            console.error("Create Sub Service error:", error);
            notification.error({
                title: "Failed to create Sub Service",
                description: getErrorMessage(error),
            });
        },
    });
}
