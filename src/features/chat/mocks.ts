import type { ChatRoomSummary, ChatMessage } from "./types";

export const CHAT_ROOMS: ChatRoomSummary[] = [
  { chatId: "chat-1", partnerName: "익명", lastMessage: "안녕하세요!", isPast: false },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: "msg-1", senderId: "me", content: "안녕하세요!", sentAt: new Date().toISOString() },
];
