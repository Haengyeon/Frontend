"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  createMatching,
  updateMatching,
  retryMatching,
  getMyMatching,
  getMatchAttempt,
  respondToMatchAttempt,
} from "./matchingApi";
import type { CreateMatchingRequest, RespondRequest, UpdateMatchingRequest } from "./types";

const MY_MATCHING_KEY = ["matchings", "me"] as const;
const matchAttemptKey = (id: string) => ["match-attempts", id] as const;

// 상태에 따라 폴링 주기를 다르게 둔다 — 검색 중일 땐 자주, 이미 확정/취소됐으면 멈춘다.
const POLLING_STATUSES = new Set(["SEARCHING", "WAITING_RESPONSE", "PAYMENT_PENDING"]);

export function useCreateMatching() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMatchingRequest) => createMatching(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(MY_MATCHING_KEY, data);
    },
  });
}

export function useUpdateMatching(matchingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMatchingRequest) => updateMatching(matchingId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(MY_MATCHING_KEY, data);
    },
  });
}

export function useRetryMatching(matchingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => retryMatching(matchingId),
    onSuccess: (data) => {
      queryClient.setQueryData(MY_MATCHING_KEY, data);
    },
  });
}

export function useMyMatching() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: MY_MATCHING_KEY,
    queryFn: getMyMatching,
    enabled: Boolean(accessToken),
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.has(status) ? 4000 : false;
    },
  });
}

export function useMatchAttempt(matchAttemptId: string | null) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: matchAttemptKey(matchAttemptId ?? ""),
    queryFn: () => getMatchAttempt(matchAttemptId as string),
    enabled: Boolean(accessToken) && Boolean(matchAttemptId),
  });
}

export function useRespondToMatchAttempt(matchAttemptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RespondRequest) => respondToMatchAttempt(matchAttemptId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchAttemptKey(matchAttemptId) });
      queryClient.invalidateQueries({ queryKey: MY_MATCHING_KEY });
    },
  });
}
