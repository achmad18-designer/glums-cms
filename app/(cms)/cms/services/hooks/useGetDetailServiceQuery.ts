
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { ServiceType } from "../types/data.type";


export const serviceDetailQueryKey = (id: number) =>
    ["services", "detail", id] as const;

export default function useGetDetailServiceQuery(
    id: number | undefined,
    enabled = true,
) {
    return useQuery({
        queryKey: serviceDetailQueryKey(id ?? 0),
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<ServiceType>>(
                `/api/v1/services/${id}`,
            );

            return response.data.data;
        },
        enabled: enabled && id !== undefined && id > 0,
        staleTime: 60 * 1000,
    });
}
