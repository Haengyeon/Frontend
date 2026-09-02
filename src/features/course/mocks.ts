import type { CourseSummary, Mission } from "./types";

export const RECOMMENDED_COURSES: CourseSummary[] = [
  {
    courseId: "course-1",
    title: "LOVE DIVE!",
    imageUrl: "/코스_1.png",
    region: "경남 남해",
    description: "탁 트인 바다 위에서 스카이다이빙을 즐기며 짜릿한 추억을 만드는 코스예요.",
  },
  {
    courseId: "course-2",
    title: "여름을 칠하다",
    imageUrl: "/코스_2.png",
    region: "전북 전주",
    description: "그림을 그리며 여유롭게 여름을 즐기는 감성 가득한 코스예요.",
  },
];

export const MOCK_MISSIONS: Mission[] = [
  {
    missionId: "m1",
    order: 1,
    placeName: "경복궁",
    location: "서울 종로구",
    description: "조선 왕조의 법궁으로, 웅장한 전각과 아름다운 후원을 함께 볼 수 있어요.",
    imageUrl: "/경복궁.png",
    done: true,
    photoMissionHint: "경회루를 배경으로 멋진 사진을 찍어보세요!",
  },
  {
    missionId: "m2",
    order: 2,
    placeName: "창덕궁",
    location: "서울 종로구",
    description: "조선 시대의 궁궐로 자연과 건축이 조화를 이루는 아름다운 궁궐이에요.",
    imageUrl: "/창덕궁.png",
    done: false,
    photoMissionHint: "인정전의 단청을 배경으로 멋진 사진을 찍어보세요!",
  },
  {
    missionId: "m3",
    order: 3,
    placeName: "국립중앙박물관",
    location: "서울 용산구",
    description: "우리나라를 대표하는 역사와 문화유산을 만날 수 있는 박물관이에요.",
    imageUrl: "/국립중앙박물관.png",
    done: false,
    photoMissionHint: "대표 소장품 앞에서 인증샷을 남겨보세요!",
  },
  {
    missionId: "m4",
    order: 4,
    placeName: "북촌한옥마을",
    location: "서울 종로구",
    description: "전통 한옥이 모여있는 골목길을 거닐며 옛 정취를 느껴보세요.",
    imageUrl: "/북촌한옥마을.png",
    done: false,
    photoMissionHint: "한옥 골목길을 배경으로 인증샷을 남겨보세요!",
  },
];

// D-1에 공개되는 코스 예상 소요 시간·복장 추천 (당일 전까지는 코스 세부 일정 비공개)
export const MOCK_COURSE_DURATION = "약 3시간 소요";
export const MOCK_COURSE_DRESS_CODE = "편한 운동화와 걷기 편한 옷차림을 추천해요";

// KOSTAT 시도 코드(skorea-provinces.json의 properties.code) → 지역 약칭 매핑
export const PROVINCE_CODE_TO_REGION: Record<string, string> = {
  "11": "서울",
  "21": "부산",
  "22": "대구",
  "23": "인천",
  "24": "광주",
  "25": "대전",
  "26": "울산",
  "29": "세종",
  "31": "경기",
  "32": "강원",
  "33": "충북",
  "34": "충남",
  "35": "전북",
  "36": "전남",
  "37": "경북",
  "38": "경남",
  "39": "제주",
};

// KOSTAT 시군구 코드(skorea-municipalities.json의 properties.code) — 다녀온 코스/미션 장소 기준
export const VISITED_DISTRICT_CODES = new Set([
  "38350", // 남해군 — LOVE DIVE! 코스
  "35011", // 전주시완산구 — 여름을 칠하다 코스
  "35012", // 전주시덕진구 — 여름을 칠하다 코스
  "11010", // 종로구 — 경복궁·창덕궁·북촌한옥마을 미션
  "11030", // 용산구 — 국립중앙박물관 미션
]);
