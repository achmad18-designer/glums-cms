
"use client";

import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { ProjectType } from "../types/data.type";
import { apiClient } from "@/lib/axios/client";

export const PROJECTS_QUERY_KEY = ["projects"] as const;

export default function useGetListProject() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ProjectType[]>>(
        "/api/v1/projects",
      );

      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
}
