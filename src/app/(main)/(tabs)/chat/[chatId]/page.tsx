"use client";

import { notFound, useParams } from "next/navigation";
import ChatRoomHeader from "@/features/chat/components/ChatRoomHeader";
import ChatRoom from "@/features/chat/components/ChatRoom";
import { useChatRoomHistory } from "@/features/chat/api/useChatApi";

export default function Page() {
  const params = useParams<{ chatId: string }>();
  const { data, isLoading, isError } = useChatRoomHistory();

  if (isLoading) return <div className="flex flex-1 flex-col" />;

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted">
        채팅방을 불러오지 못했어요.
      </div>
    );
  }

  const room = data?.rooms.find((item) => item.id === params.chatId);
  if (!room) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <ChatRoomHeader room={room} />
      <ChatRoom room={room} />
    </div>
  );
}
