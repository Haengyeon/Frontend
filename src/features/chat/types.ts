export type ChatRoomSummary = {
  chatId: string;
  partnerName: string;
  lastMessage: string;
  isPast: boolean;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
};
