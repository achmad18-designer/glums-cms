
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { TeamType } from "../types/data.type";

export const TEAMS_QUERY_KEY = ["teams"] as const;

export default function useGetListTeamQuery() {
    return useQuery({
        queryKey: TEAMS_QUERY_KEY,
        queryFn: async (): Promise<TeamType[]> => {
            const response = await apiClient.get<ApiResponse<TeamType[]>>(
                "/api/v1/users/teams",
            );

            return response.data.data;
        },
        staleTime: 60 * 1000,
    });
}
