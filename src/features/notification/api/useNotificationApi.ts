"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getNotificationSetting, updateNotificationSetting } from "./notificationApi";

const NOTIFICATION_SETTING_KEY = ["notifications", "settings"] as const;

export function useNotificationSetting() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: NOTIFICATION_SETTING_KEY,
    queryFn: getNotificationSetting,
    enabled: Boolean(accessToken),
  });
}

export function useUpdateNotificationSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSetting,
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATION_SETTING_KEY, data);
    },
  });
}
