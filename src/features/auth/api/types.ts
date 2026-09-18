// public/img/API명세_프로필.md 기준. jobCategory/hobbies enum은 매칭 API와 동일한 서버 enum을 쓴다.
import type { ApiJobCategory, ApiHobby } from "@/features/matching/api/types";

export type ApiGender = "MALE" | "FEMALE" | "OTHER";

export type ApiMbti =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";

// 사진은 URL 문자열이 아니라 파일로 보낸다 — POST/PATCH /profiles가
// multipart/form-data(profile JSON + profileImage/fullBodyImage 파일)만 받는다.
export type CreateProfileRequest = {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: ApiGender;
  mbti?: ApiMbti;
  introduce: string;
  jobCategory: ApiJobCategory;
  jobPrivate?: boolean;
  hobbies: ApiHobby[];
  profileImage: File;
  fullBodyImage: File;
};

export type UpdateProfileRequest = Partial<
  Pick<CreateProfileRequest, "mbti" | "introduce" | "jobCategory" | "jobPrivate" | "hobbies">
> & {
  // 사진을 바꿀 때만 보낸다. 안 보내면 기존 사진이 유지된다.
  profileImage?: File;
  fullBodyImage?: File;
};

export type ProfileResponse = {
  id: string;
  name: string;
  age: number;
  gender: ApiGender;
  mbti: ApiMbti | null;
  introduce: string;
  jobCategory: ApiJobCategory;
  jobPrivate: boolean;
  hobbies: ApiHobby[];
  profileImageUrl: string;
  fullBodyImageUrl: string;
  createdAt: string;
};
