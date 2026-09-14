import { apiRequest } from "@/lib/api/client";
import type { NotificationSettingResponse, UpdateNotificationSettingRequest } from "./types";

export function getNotificationSetting() {
  return apiRequest<NotificationSettingResponse>("/notifications/settings");
}

export function updateNotificationSetting(payload: UpdateNotificationSettingRequest) {
  return apiRequest<NotificationSettingResponse>("/notifications/settings", {
    method: "PATCH",
    body: payload,
  });
}
