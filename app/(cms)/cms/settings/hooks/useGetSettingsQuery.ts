
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { SettingsDataType } from "../types/data.type";
export const SETTINGS_QUERY_KEY = ["settings"] as const;

export default function useGetSettingsQuery() {
    return useQuery({
        queryKey: SETTINGS_QUERY_KEY,
        queryFn: async (): Promise<SettingsDataType> => {
            const response = await apiClient.get<ApiResponse<SettingsDataType>>(
                "/api/v1/settings",
            );

            return response.data.data;
        },
        staleTime: 60 * 1000,
    });
}
