"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import CourseInfoAccordion from "@/features/chat/components/CourseInfoAccordion";
import ChatBubble from "@/features/chat/components/ChatBubble";
import ChatComposer from "@/features/chat/components/ChatComposer";
import { useDaysUntilTrip } from "@/features/matching/hooks/useDaysUntilTrip";
import type { ChatMessage, ChatRoomSummary } from "@/features/chat/types";

const LIMITED_MESSAGE_CAP = 10;

type ChatRoomProps = {
  room: ChatRoomSummary;
};

export default function ChatRoom({ room }: ChatRoomProps) {
  const daysUntilTrip = useDaysUntilTrip();
  const [messages, setMessages] = useState<ChatMessage[]>(room.messages);

  const isLocked = !room.isPast && (daysUntilTrip === null || daysUntilTrip > 1);
  const isLimited = !room.isPast && daysUntilTrip === 1;
  const sentMessageCount = messages.filter((message) => message.senderId === "me").length;
  const capReached = isLimited && sentMessageCount >= LIMITED_MESSAGE_CAP;

  if (isLocked) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <Lock size={28} strokeWidth={1.5} className="text-muted" />
        <p className="text-sm font-medium text-ink">채팅은 여행 D-1부터 열려요</p>
      </div>
    );
  }

  const handleSend = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, senderId: "me", content, sentAt: "" },
    ]);
  };

  return (
    <div className="flex flex-1 flex-col">
      <CourseInfoAccordion courseInfo={room.courseInfo} />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>

      {capReached ? (
        <div className="flex flex-col items-center gap-2 border-t border-line bg-cream-card p-4 text-center">
          <p className="text-sm text-muted">무료 채팅 횟수를 다 사용했어요.</p>
          <button
            type="button"
            className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-white"
          >
            연장하기
          </button>
        </div>
      ) : (
        <ChatComposer limited={isLimited} onSend={handleSend} />
      )}
    </div>
  );
}
