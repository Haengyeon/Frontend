// public/img/API명세_결제채팅.md + 실서버(/api-json) 기준.
import type { ApiGender, ApiMbti } from "@/features/auth/api/types";
import type { ApiJobCategory, ApiHobby } from "@/features/matching/api/types";

export type ChatRoomStatus = "LOCKED" | "OPEN" | "CLOSED" | "DISABLED";

export type ChatPartnerProfile = {
  name: string;
  age: number;
  gender: ApiGender;
  /** jobPrivate가 true면 null */
  jobCategory: ApiJobCategory | null;
  mbti: ApiMbti | null;
  introduce: string;
  hobbies: ApiHobby[];
  profileImageUrl: string;
  fullBodyImageUrl: string;
};

export type ChatRoom = {
  id: string;
  /** 신고/차단 API에 그대로 넘기는 값 (아직 관련 API 미제공) */
  matchAttemptId: string;
  status: ChatRoomStatus;
  openAt: string;
  travelDate: string;
  myRemainingCount: number;
  partner: ChatPartnerProfile;
};

export type ChatMessage = {
  id: string;
  content: string;
  isMine: boolean;
  createdAt: string;
};

export type ChatMessageListResponse = {
  messages: ChatMessage[];
  nextCursor: string | null;
  myRemainingCount: number;
};
