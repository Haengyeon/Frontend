import { apiRequest } from "@/lib/api/client";
import type { FestivalListResponse } from "@/features/events/types";

export function getFestivals(params: { cursor?: string; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiRequest<FestivalListResponse>(`/festivals${qs ? `?${qs}` : ""}`);
}
