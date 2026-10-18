
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios/client";
import { SERVICES_QUERY_KEY } from "./useGetListServicesQuery";

export default function useDeleteServiceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/v1/services/${id}`);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: SERVICES_QUERY_KEY,
            });
        },
    });
}
