"use client";

import { notFound, useParams } from "next/navigation";
import ChatRoomHeader from "@/features/chat/components/ChatRoomHeader";
import ChatRoom from "@/features/chat/components/ChatRoom";
import { useMyChatRoom } from "@/features/chat/api/useChatApi";
import { ApiError } from "@/lib/api/client";

export default function Page() {
  const params = useParams<{ chatId: string }>();
  const { data: room, isLoading, error } = useMyChatRoom();

  if (isLoading) return <div className="flex flex-1 flex-col" />;

  if (error && !(error instanceof ApiError && error.statusCode === 404)) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted">
        채팅방을 불러오지 못했어요.
      </div>
    );
  }

  // 채팅방은 "내 활성 채팅방" 하나만 존재해서, URL의 chatId가 그것과 다르면 접근할 수 없는 채팅방이다.
  if (!room || room.id !== params.chatId) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <ChatRoomHeader room={room} />
      <ChatRoom room={room} />
    </div>
  );
}
