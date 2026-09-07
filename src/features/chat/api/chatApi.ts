import { apiRequest } from "@/lib/api/client";
import type { ChatRoom, ChatMessage, ChatMessageListResponse } from "./types";

export function getMyChatRoom() {
  return apiRequest<ChatRoom>("/chat-rooms/me");
}

export function getChatMessages(chatRoomId: string, params: { cursor?: string; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiRequest<ChatMessageListResponse>(
    `/chat-rooms/${chatRoomId}/messages${qs ? `?${qs}` : ""}`,
  );
}

export function sendChatMessage(chatRoomId: string, content: string) {
  return apiRequest<ChatMessage>(`/chat-rooms/${chatRoomId}/messages`, {
    method: "POST",
    body: { content },
  });
}
