"use client";

import ChatRoomListItem from "@/features/chat/components/ChatRoomListItem";
import DemoDataNotice from "@/components/ui/DemoDataNotice";
import { useChatRoomHistory } from "@/features/chat/api/useChatApi";

const ACTIVE_STATUSES = new Set(["LOCKED", "OPEN"]);

export default function Page() {
  const { data, isLoading, isError } = useChatRoomHistory();
  const rooms = data?.rooms ?? [];
  const activeRooms = rooms.filter((room) => ACTIVE_STATUSES.has(room.status));
  const pastRooms = rooms.filter((room) => !ACTIVE_STATUSES.has(room.status));

  if (isLoading) return null;

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted">
        채팅방을 불러오지 못했어요.
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
        <p className="pt-8 text-center text-sm text-muted">아직 채팅방이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      {activeRooms.length > 0 ? (
        <div className="flex flex-col">
          <span className="pb-1 text-sm font-medium text-ink">진행중인 채팅</span>
          <div className="flex flex-col divide-y divide-line">
            {activeRooms.map((room) => (
              <ChatRoomListItem key={room.id} room={room} />
            ))}
          </div>
        </div>
      ) : null}

      {pastRooms.length > 0 ? (
        <div className="flex flex-col">
          <span className="pb-1 text-sm font-medium text-ink">지난 채팅</span>
          <div className="flex flex-col divide-y divide-line">
            {pastRooms.map((room) => (
              <ChatRoomListItem key={room.id} room={room} />
            ))}
          </div>
        </div>
      ) : null}
      <DemoDataNotice />
    </div>
  );
}
