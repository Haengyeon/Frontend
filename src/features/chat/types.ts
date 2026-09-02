export type ChatMessage = {
  id: string;
  senderId: "me" | "partner";
  content: string;
  sentAt: string;
};

export type ChatCourseInfo = {
  courseTitle: string;
  modeLabel: string;
  durationLabel: string;
  stopOrder: string[];
};

export type ChatRoomSummary = {
  chatId: string;
  partnerName: string;
  partnerPhotoUrl: string;
  lastMessage: string;
  isPast: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  courseInfo: ChatCourseInfo;
};
