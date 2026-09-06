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

export type CreateProfileRequest = {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: ApiGender;
  mbti?: ApiMbti;
  introduce: string;
  jobCategory: ApiJobCategory;
  jobPrivate?: boolean;
  hobbies: ApiHobby[];
  profileImageUrl: string;
  fullBodyImageUrl: string;
};

export type UpdateProfileRequest = Partial<
  Pick<
    CreateProfileRequest,
    "mbti" | "introduce" | "jobCategory" | "jobPrivate" | "hobbies" | "profileImageUrl" | "fullBodyImageUrl"
  >
>;

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
