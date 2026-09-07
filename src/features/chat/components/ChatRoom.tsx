"use client";

import { Lock } from "lucide-react";
import CourseInfoAccordion from "@/features/chat/components/CourseInfoAccordion";
import ChatBubble from "@/features/chat/components/ChatBubble";
import ChatComposer from "@/features/chat/components/ChatComposer";
import { useChatMessages, useSendChatMessage } from "@/features/chat/api/useChatApi";
import { formatDateLabel, toDateValue } from "@/features/matching/mocks";
import type { ChatRoom as ChatRoomData } from "@/features/chat/api/types";
import { ApiError } from "@/lib/api/client";

type ChatRoomProps = {
  room: ChatRoomData;
};

const CLOSED_NOTICE: Record<"CLOSED" | "DISABLED", string> = {
  CLOSED: "종료된 채팅방입니다.",
  DISABLED: "사용할 수 없는 채팅방입니다.",
};

export default function ChatRoom({ room }: ChatRoomProps) {
  const isOpen = room.status === "OPEN";
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, refetch } = useChatMessages(
    room.id,
    isOpen,
  );
  const sendMessage = useSendChatMessage(room.id);

  // 서버가 최신순으로 내려주는 각 페이지를 이어붙인 뒤 통째로 뒤집으면 오래된 순으로 정렬된다.
  const messages = [...(data?.pages.flatMap((page) => page.messages) ?? [])].reverse();

  if (room.status === "LOCKED") {
    return (
      <div className="flex flex-1 flex-col">
        <CourseInfoAccordion />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <Lock size={28} strokeWidth={1.5} className="text-muted" />
          <p className="text-sm font-medium text-ink">
            채팅은 {formatDateLabel(toDateValue(new Date(room.openAt)))}부터 열려요
          </p>
        </div>
      </div>
    );
  }

  const handleSend = (content: string) => sendMessage.mutateAsync(content);

  return (
    <div className="flex flex-1 flex-col">
      <CourseInfoAccordion />

      {isError && !data ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-sm text-muted">메시지를 불러오지 못했어요.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-forest underline underline-offset-2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="self-center text-xs text-muted underline underline-offset-2 disabled:opacity-50"
            >
              {isFetchingNextPage ? "불러오는 중..." : "이전 메시지 더 보기"}
            </button>
          ) : null}
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>
      )}

      {sendMessage.isError ? (
        <p className="px-6 pb-2 text-center text-xs text-red-500">
          {sendMessage.error instanceof ApiError ? sendMessage.error.message : "전송에 실패했어요."}
        </p>
      ) : null}

      {room.status === "CLOSED" || room.status === "DISABLED" ? (
        <div className="flex flex-col items-center gap-2 border-t border-line bg-cream-card p-4 text-center">
          <p className="text-sm text-muted">{CLOSED_NOTICE[room.status]}</p>
        </div>
      ) : (
        <ChatComposer
          remainingCount={room.myRemainingCount}
          onSend={handleSend}
          disabled={sendMessage.isPending}
        />
      )}
    </div>
  );
}
