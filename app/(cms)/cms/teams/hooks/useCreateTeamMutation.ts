
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useCreateTeamMutation() {
    const notification = useAppNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData): Promise<TeamType> => {
            const response = await apiClient.post<ApiResponse<TeamType>>(
                "/api/v1/users/register/team",
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            // Refresh cache daftar project setelah berhasil membuat project.
            await queryClient.invalidateQueries({
                queryKey: ["teams"],
            });
            notification.success({
                title: "Success",
                description: "Team created successfully",
            });
        },

        onError: (error) => {
            console.error("Create Team error:", error);
            notification.error({
                title: "Failed to create Team",
                description: getErrorMessage(error),
            });
        },
    });
}
