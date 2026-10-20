
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { SubServiceType } from "../types/data.type";

export const subServiceDetailQueryKey = (id: number) =>
    ["sub-services", "detail", id] as const;

export default function useGetDetailSubServiceQuery(
    id: number | undefined,
    enabled = true,
) {
    return useQuery({
        queryKey: subServiceDetailQueryKey(id ?? 0),
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<SubServiceType>>(
                `/api/v1/sub-services/${id}`,
            );

            return response.data.data;
        },
        enabled: enabled && id !== undefined && id > 0,
        staleTime: 60 * 1000,
    });
}
