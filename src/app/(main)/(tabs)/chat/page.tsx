"use client";

import ChatRoomListItem from "@/features/chat/components/ChatRoomListItem";
import { useMyChatRoom } from "@/features/chat/api/useChatApi";
import { ApiError } from "@/lib/api/client";

export default function Page() {
  const { data: room, isLoading, error } = useMyChatRoom();

  if (isLoading) return null;

  if (error && !(error instanceof ApiError && error.statusCode === 404)) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted">
        채팅방을 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      {room ? (
        <div className="flex flex-col">
          <span className="pb-1 text-sm font-medium text-ink">진행중인 채팅</span>
          <div className="flex flex-col divide-y divide-line">
            <ChatRoomListItem room={room} />
          </div>
        </div>
      ) : (
        <p className="pt-8 text-center text-sm text-muted">아직 채팅방이 없어요.</p>
      )}
    </div>
  );
}
