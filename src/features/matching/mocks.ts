import type { MatchingTheme, MatchProfile } from "./types";

export const MATCHING_THEMES: MatchingTheme[] = [
  { id: "nature", label: "자연 · 힐링", imageUrl: "" },
  { id: "food", label: "맛집 탐방", imageUrl: "" },
  { id: "culture", label: "역사 · 문화", imageUrl: "" },
];

export const MOCK_MATCH_PROFILE: MatchProfile = {
  attemptId: "mock-attempt-1",
  name: "익명",
  age: 27,
  job: "디자인",
  interestTags: ["카페", "사진"],
  bio: "함께 걸으며 이야기 나눠요",
  photoUrl: "",
};
