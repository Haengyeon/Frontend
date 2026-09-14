import { apiRequest } from "@/lib/api/client";
import type { ChatMessage, ChatMessageListResponse, ChatRoomHistoryResponse } from "./types";

export function getChatRoomHistory() {
  return apiRequest<ChatRoomHistoryResponse>("/chat-rooms");
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
