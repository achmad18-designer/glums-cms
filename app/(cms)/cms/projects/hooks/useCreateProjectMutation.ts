
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectType } from "../types/data.type";

export function useCreateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post<ApiResponse<ProjectType>>(
                "/api/v1/projects",
                formData,
            );

            return response.data.data;
        },

        onSuccess: async () => {
            // Refresh cache daftar project setelah berhasil membuat project.
            await queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },
    });
}
