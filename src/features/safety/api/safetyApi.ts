import { apiRequest } from "@/lib/api/client";
import type { CreateReportRequest, Report, ReportListResponse, BlockListResponse } from "./types";

export function createReport(payload: CreateReportRequest) {
  return apiRequest<Report>("/safety/reports", { method: "POST", body: payload });
}

export function getMyReports() {
  return apiRequest<ReportListResponse>("/safety/reports");
}

export function getMyBlocks() {
  return apiRequest<BlockListResponse>("/safety/blocks");
}
