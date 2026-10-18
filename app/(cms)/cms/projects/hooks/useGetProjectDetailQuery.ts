
"use client";

import { apiClient } from "@/lib/axios/client";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { ProjectType } from "../types/data.type";

export const projectDetailQueryKey = (id: number) =>
  ["projects", "detail", id] as const;

export default function useGetProjectDetail(
  id: number | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: projectDetailQueryKey(id ?? 0),
    queryFn: async (): Promise<ProjectType> => {
      const response = await apiClient.get<ApiResponse<ProjectType>>(
        `/api/v1/projects/${id}`,
      );

      return response.data.data;
    },
    enabled: enabled && id !== undefined && id > 0,
    staleTime: 60 * 1000,
  });
}
