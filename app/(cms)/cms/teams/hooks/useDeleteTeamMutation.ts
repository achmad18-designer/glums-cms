
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios/client";
import { TEAMS_QUERY_KEY } from "./useGetListTeamsQuery";
import { useAppNotification } from "@/components/providers/NotificationProvider";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function useDeleteTeamMutation() {
    const queryClient = useQueryClient();
    const notification = useAppNotification();

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/v1/users/teams/${id}`);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: TEAMS_QUERY_KEY,
            });
            notification.success({
                title: "Success",
                description: "Team deleted successfully",
            });
        },

        onError: (error) => {
            console.error("Delete team error:", error);
            notification.error({
                title: "Failed to delete team",
                description: getErrorMessage(error),
            });
        }
    });
}
