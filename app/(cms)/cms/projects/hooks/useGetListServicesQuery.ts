
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { ServicesType } from "../types/data.type";

export const PROJECTS_QUERY_KEY = ["services"] as const;

export default function useGetListServicesQuery() {
    return useQuery({
        queryKey: PROJECTS_QUERY_KEY,
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<ServicesType[]>>(
                "/api/v1/services",
            );

            return response.data.data;
        },
        staleTime: 60 * 1000,
    });
}
