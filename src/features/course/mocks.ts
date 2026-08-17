import type { CourseSummary, Mission } from "./types";

export const RECOMMENDED_COURSES: CourseSummary[] = [
  { courseId: "course-1", title: "LOVE DIVE!", imageUrl: "/코스_1.png", region: "경남 남해" },
  { courseId: "course-2", title: "여름을 칠하다", imageUrl: "/코스_2.png", region: "전북 전주" },
];

export const MOCK_MISSIONS: Mission[] = [
  { missionId: "m1", order: 1, placeName: "장소 1", description: "", status: "done" },
  { missionId: "m2", order: 2, placeName: "장소 2", description: "", status: "current" },
  { missionId: "m3", order: 3, placeName: "장소 3", description: "", status: "locked" },
  { missionId: "m4", order: 4, placeName: "?", description: "", status: "locked" },
];
