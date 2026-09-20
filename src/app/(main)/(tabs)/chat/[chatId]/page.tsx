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

  // 채팅만 화면 전체 스크롤에서 빼내 헤더·입력창은 고정하고 메시지 목록만 스크롤한다.
  // 다른 화면들은 여전히 (main) 프레임 전체가 스크롤되므로, 여기만 뷰포트에 고정된
  // 독립적인 영역으로 떼어내야 한다(BottomNav가 이미 쓰는 것과 같은 fixed 방식).
  return (
    <div className="fixed left-1/2 top-0 bottom-16 flex w-full max-w-md -translate-x-1/2 flex-col bg-cream">
      <ChatRoomHeader room={room} />
      <ChatRoom room={room} />
    </div>
  );
}
