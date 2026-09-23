"use client";

import { useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import CourseInfoAccordion from "@/features/chat/components/CourseInfoAccordion";
import ChatBubble from "@/features/chat/components/ChatBubble";
import ChatComposer from "@/features/chat/components/ChatComposer";
import { useChatMessages, useMarkChatRoomAsRead, useSendChatMessage } from "@/features/chat/api/useChatApi";
import { formatDateLabel, toDateValue } from "@/features/matching/mocks";
import type { ChatRoomSummary } from "@/features/chat/api/types";
import { ApiError } from "@/lib/api/client";

type ChatRoomProps = {
  room: ChatRoomSummary;
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
  const markAsRead = useMarkChatRoomAsRead(room.id);

  // 방을 열람하는 시점(LOCKED가 아니어서 메시지가 존재할 수 있을 때)에 읽음 처리한다.
  useEffect(() => {
    if (room.status === "LOCKED") return;
    markAsRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id, room.status]);

  // 서버가 최신순으로 내려주는 각 페이지를 이어붙인 뒤 통째로 뒤집으면 오래된 순으로 정렬된다.
  const messages = [...(data?.pages.flatMap((page) => page.messages) ?? [])].reverse();

  if (room.status === "LOCKED") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <CourseInfoAccordion matchAttemptId={room.matchAttemptId} />
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
    <div className="flex min-h-0 flex-1 flex-col">
      <CourseInfoAccordion matchAttemptId={room.matchAttemptId} />

      {room.isExperience ? (
        <div className="mx-6 mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
          <Sparkles size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
          <p>
            💬 체험 매칭이에요. 상대는 가상 프로필이라 정해진 답변만 보내요.
            <br />
            (체험 대화는 여기까지예요. 실제 매칭에서는 상대와 자유롭게 대화할 수 있어요)
          </p>
        </div>
      ) : null}

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
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6">
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
