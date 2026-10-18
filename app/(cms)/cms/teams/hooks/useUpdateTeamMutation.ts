
"use client";

import { apiClient } from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface UpdateServiceVariables {
    id: number;
    formData: FormData;
}

export function useUpdateTeamMutation() {
    const queryClient = useQueryClient();
    const notification = useAppNotification();

    return useMutation({
        mutationFn: async ({
            id,
            formData,
        }: UpdateServiceVariables): Promise<TeamType> => {
            const response = await apiClient.patch<ApiResponse<TeamType>>(
                `/api/v1/users/teams/${id}`,
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["teams"]
            })
            notification.success({
                title: "Success",
                description: "Team updated successfully",
            });
        },

        onError: (error) => {
            console.error("Create Service error:", error);
            notification.error({
                title: "Failed to update Service",
                description: getErrorMessage(error),
            });
        },
    });
}
