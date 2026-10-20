
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { SubServiceType } from "../types/data.type";

export const SUB_SERVICES_QUERY_KEY = ["sub-services"] as const;

export default function useGetListServicesQuery() {
    return useQuery({
        queryKey: SUB_SERVICES_QUERY_KEY,
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<SubServiceType[]>>(
                "/api/v1/sub-services",
            );

            return response.data.data;
        },
        staleTime: 60 * 1000,
    });
}
