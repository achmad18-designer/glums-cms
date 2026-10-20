
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios/client";
import { SUB_SERVICES_QUERY_KEY } from "./useGetListSubServicesQuery";

export default function useDeleteSubServiceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/v1/sub-services/${id}`);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: SUB_SERVICES_QUERY_KEY,
            });
        },
    });
}
