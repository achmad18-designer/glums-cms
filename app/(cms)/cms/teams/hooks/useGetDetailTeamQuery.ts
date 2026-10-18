
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { TeamType } from "../types/data.type";

export const teamDetailQueryKey = (id: number) =>
    ["teams", "detail", id] as const;

export default function useGetDetailTeamQuery(
    id: number | undefined,
    enabled = true,
) {
    return useQuery({
        queryKey: teamDetailQueryKey(id ?? 0),
        queryFn: async () => {
            const response = await apiClient.post<ApiResponse<TeamType>>(
                `/api/v1/users/teams`,
                { id },
            );

            return response.data.data;
        },
        enabled: enabled && id !== undefined && id > 0,
        staleTime: 60 * 1000,
    });
}
