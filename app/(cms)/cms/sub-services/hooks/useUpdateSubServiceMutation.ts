
"use client";

import { apiClient } from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubServiceType } from "../types/data.type";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface UpdateServiceVariables {
    id: number;
    formData: FormData;
}

export function useUpdateSubServiceMutation() {
    const queryClient = useQueryClient();
    const notification = useAppNotification();

    return useMutation({
        mutationFn: async ({
            id,
            formData,
        }: UpdateServiceVariables): Promise<SubServiceType> => {
            const response = await apiClient.patch<ApiResponse<SubServiceType>>(
                `/api/v1/sub-services/${id}`,
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["sub-services"]
            })
        },

        onError: (error) => {
            console.error("Create Service error:", error);
            notification.error({
                title: "Failed to update SUb Service",
                description: getErrorMessage(error),
            });
        },
    });
}
