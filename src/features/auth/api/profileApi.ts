import { apiRequest } from "@/lib/api/client";
import type { CreateProfileRequest, UpdateProfileRequest, ProfileResponse } from "./types";

// profile 필드는 JSON 문자열로, 사진은 파일로 함께 담아 보낸다(백엔드가
// multipart/form-data만 받음). 파일과 함께 보내는 요청이라 JSON.stringify(payload)로
// 통째로 보낼 수 없어서 여기서 폼으로 조립한다.
function buildProfileFormData({
  profileImage,
  fullBodyImage,
  ...fields
}: CreateProfileRequest | UpdateProfileRequest) {
  const formData = new FormData();
  formData.append("profile", JSON.stringify(fields));
  if (profileImage) formData.append("profileImage", profileImage);
  if (fullBodyImage) formData.append("fullBodyImage", fullBodyImage);
  return formData;
}

export function createProfile(payload: CreateProfileRequest) {
  return apiRequest<ProfileResponse>("/profiles", { method: "POST", body: buildProfileFormData(payload) });
}

export function getMyProfile() {
  return apiRequest<ProfileResponse>("/profiles/me");
}

export function updateProfile(payload: UpdateProfileRequest) {
  return apiRequest<ProfileResponse>("/profiles/me", { method: "PATCH", body: buildProfileFormData(payload) });
}
