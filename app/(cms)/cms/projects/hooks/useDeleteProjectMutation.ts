
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios/client";
import { PROJECTS_QUERY_KEY } from "./useGetProjectsQuery";

export default function useDeleteProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/v1/projects/${id}`);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}
