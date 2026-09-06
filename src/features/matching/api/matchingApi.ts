import { apiRequest } from "@/lib/api/client";
import type {
  CreateMatchingRequest,
  UpdateMatchingRequest,
  MatchingResponse,
  MatchAttemptDetail,
  RespondRequest,
} from "./types";

export function createMatching(payload: CreateMatchingRequest) {
  return apiRequest<MatchingResponse>("/matchings", { method: "POST", body: payload });
}

export function updateMatching(matchingId: string, payload: UpdateMatchingRequest) {
  return apiRequest<MatchingResponse>(`/matchings/${matchingId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function retryMatching(matchingId: string) {
  return apiRequest<MatchingResponse>(`/matchings/${matchingId}/retry`, { method: "POST" });
}

export function getMyMatching() {
  return apiRequest<MatchingResponse>("/matchings/me");
}

export function getMatchAttempt(matchAttemptId: string) {
  return apiRequest<MatchAttemptDetail>(`/match-attempts/${matchAttemptId}`);
}

export function respondToMatchAttempt(matchAttemptId: string, payload: RespondRequest) {
  return apiRequest<void>(`/match-attempts/${matchAttemptId}/respond`, {
    method: "POST",
    body: payload,
  });
}
