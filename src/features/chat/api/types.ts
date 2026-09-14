// public/img/API명세_결제채팅.md + 실서버(/api-json) 기준.

export type ChatRoomStatus = "LOCKED" | "OPEN" | "CLOSED" | "DISABLED";

/** GET /chat-rooms(목록) 응답 — 종료·차단된 방까지 전부 최신순으로 내려온다. */
export type ChatRoomSummary = {
  id: string;
  matchAttemptId: string;
  status: ChatRoomStatus;
  openAt: string;
  travelDate: string;
  myRemainingCount: number;
  partnerName: string;
  partnerProfileImageUrl: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
};

export type ChatRoomHistoryResponse = {
  rooms: ChatRoomSummary[];
};

export type ChatMessage = {
  id: string;
  content: string;
  isMine: boolean;
  createdAt: string;
};

export type ChatMessageListResponse = {
  messages: ChatMessage[];
  nextCursor: string | null;
  myRemainingCount: number;
};
