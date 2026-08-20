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
  messages: ChatMessage[];
  courseInfo: ChatCourseInfo;
};
