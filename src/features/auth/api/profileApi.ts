import { apiRequest } from "@/lib/api/client";
import type { CreateProfileRequest, UpdateProfileRequest, ProfileResponse } from "./types";

export function createProfile(payload: CreateProfileRequest) {
  return apiRequest<ProfileResponse>("/profiles", { method: "POST", body: payload });
}

export function getMyProfile() {
  return apiRequest<ProfileResponse>("/profiles/me");
}

export function updateProfile(payload: UpdateProfileRequest) {
  return apiRequest<ProfileResponse>("/profiles/me", { method: "PATCH", body: payload });
}
