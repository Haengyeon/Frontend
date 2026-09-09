"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { createReport, getMyReports, getMyBlocks } from "./safetyApi";
import type { CreateReportRequest } from "./types";

const MY_REPORTS_KEY = ["safety", "reports"] as const;
const MY_BLOCKS_KEY = ["safety", "blocks"] as const;

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReportRequest) => createReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_REPORTS_KEY });
    },
  });
}

export function useMyReports() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: MY_REPORTS_KEY,
    queryFn: getMyReports,
    enabled: Boolean(accessToken),
  });
}

export function useMyBlocks() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: MY_BLOCKS_KEY,
    queryFn: getMyBlocks,
    enabled: Boolean(accessToken),
  });
}
