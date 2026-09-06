"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { createProfile, getMyProfile, updateProfile } from "./profileApi";
import type { CreateProfileRequest, UpdateProfileRequest } from "./types";

const MY_PROFILE_KEY = ["profile", "me"] as const;

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  return useMutation({
    mutationFn: (payload: CreateProfileRequest) => createProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(MY_PROFILE_KEY, data);
      setHasProfile(true);
    },
  });
}

export function useMyProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasProfile = useAuthStore((state) => state.hasProfile);
  return useQuery({
    queryKey: MY_PROFILE_KEY,
    queryFn: getMyProfile,
    enabled: Boolean(accessToken) && hasProfile === true,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(MY_PROFILE_KEY, data);
    },
  });
}
