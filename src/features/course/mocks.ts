import type { CourseSummary, Mission, StampRegion } from "./types";

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
    imageUrl: "/코스_1.png",
    done: true,
  },
  {
    missionId: "m2",
    order: 2,
    placeName: "창덕궁",
    location: "서울 종로구",
    description: "조선 시대의 궁궐로 자연과 건축이 조화를 이루는 아름다운 궁궐이에요.",
    imageUrl: "/코스_2.png",
    done: false,
  },
  {
    missionId: "m3",
    order: 3,
    placeName: "국립중앙박물관",
    location: "서울 용산구",
    description: "우리나라를 대표하는 역사와 문화유산을 만날 수 있는 박물관이에요.",
    imageUrl: "/테마_문화.png",
    done: false,
  },
  {
    missionId: "m4",
    order: 4,
    placeName: "북촌한옥마을",
    location: "서울 종로구",
    description: "전통 한옥이 모여있는 골목길을 거닐며 옛 정취를 느껴보세요.",
    imageUrl: "/테마_카페.png",
    done: false,
  },
];

const VISITED_REGIONS = new Set(["경남", "전북"]);

export const STAMP_REGIONS: StampRegion[] = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
].map((name) => ({ name, visited: VISITED_REGIONS.has(name) }));
