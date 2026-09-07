import { apiRequest } from "@/lib/api/client";
import type { PointsResponse, PointHistoryResponse, StampsResponse } from "./types";

export function getPoints() {
  return apiRequest<PointsResponse>("/rewards/points");
}

export function getPointHistory(params: { limit?: number; cursor?: string } = {}) {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  const qs = query.toString();
  return apiRequest<PointHistoryResponse>(`/rewards/points/history${qs ? `?${qs}` : ""}`);
}

export function getStamps() {
  return apiRequest<StampsResponse>("/rewards/stamps");
}
