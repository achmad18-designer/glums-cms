
"use client";

import { apiClient } from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SettingsDataType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useUpdateSettingsMutation() {
    const queryClient = useQueryClient();
    const notification = useAppNotification();

    return useMutation({
        mutationFn: async (formData: FormData): Promise<SettingsDataType> => {
            const response = await apiClient.patch<ApiResponse<SettingsDataType>>(
                `/api/v1/settings/1`,
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["settings"]
            })
            notification.success({
                title: "Success",
                description: "Settings updated successfully",
            });
        },

        onError: (error) => {
            console.error("Update Settings error:", error);
            notification.error({
                title: "Failed to update Settings",
                description: getErrorMessage(error),
            });
        },
    });
}
