"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getMyChatRoom, getChatMessages, sendChatMessage } from "./chatApi";

const CHAT_ROOM_KEY = ["chat-room", "me"] as const;
const messagesKey = (chatRoomId: string) => ["chat-room", chatRoomId, "messages"] as const;

export function useMyChatRoom() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: CHAT_ROOM_KEY,
    queryFn: getMyChatRoom,
    enabled: Boolean(accessToken),
    retry: false,
    // 아직 LOCKED면 openAt 시각에 자동으로 OPEN이 되므로, 그 전환을 놓치지 않게 짧게 폴링한다.
    refetchInterval: (query) => (query.state.data?.status === "LOCKED" ? 5000 : false),
  });
}

export function useChatMessages(chatRoomId: string | null, pollWhenOpen: boolean) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: messagesKey(chatRoomId ?? ""),
    queryFn: ({ pageParam }) =>
      getChatMessages(chatRoomId as string, { cursor: pageParam ?? undefined, limit: 30 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken) && Boolean(chatRoomId),
    // OPEN 상태에서만 상대 메시지가 새로 올 수 있으니 그때만 폴링한다.
    refetchInterval: pollWhenOpen ? 4000 : false,
  });
}

export function useSendChatMessage(chatRoomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendChatMessage(chatRoomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(chatRoomId) });
      queryClient.invalidateQueries({ queryKey: CHAT_ROOM_KEY });
    },
  });
}
