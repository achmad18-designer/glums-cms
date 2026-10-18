
"use client";

import { apiClient } from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectType } from "../types/data.type";

interface UpdateProjectVariables {
    id: number;
    formData: FormData;
}

export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            formData,
        }: UpdateProjectVariables): Promise<ProjectType> => {
            const response = await apiClient.patch<ApiResponse<ProjectType>>(
                `/api/v1/projects/${id}`,
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
        },
    });
}
