// public/img/API명세_리워드.md + 실서버 응답 기준 (OpenAPI에 DTO 스키마가 안 걸려있어 직접 curl로 확인함).
import type { ApiRegion } from "@/features/matching/api/types";

export type PointsResponse = {
  points: number;
};

export type PointTransactionType = "EARN" | "USE" | "EXPIRE";

export type PointTransaction = {
  id: string;
  type: PointTransactionType;
  amount: number;
  pointsAfter: number;
  /** 화면에 그대로 출력. 코스 적립이면 코스명 */
  reason: string;
  /** 적립 종류 코드. 화면 출력용 아님 */
  reasonCode: string;
  courseId: string | null;
  createdAt: string;
};

export type PointHistoryResponse = {
  items: PointTransaction[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type Stamp = {
  region: ApiRegion;
  regionLabel: string;
  sigunguName: string | null;
  /**
   * 지도 색칠용. southkorea-maps kostat/2018의 SIG_CD 배열.
   * 스탬프는 시군구 단위인데 지도는 그보다 더 잘게 나눠 그린 곳(예: 수원시 4개 구)이 있어서,
   * 스탬프 하나가 지도 칸 여러 개에 대응할 수 있다 — 그 칸들을 전부 담아온다.
   */
  mapSigunguCodes: string[];
  courseId: string;
  earnedAt: string;
};

export type StampsResponse = {
  collectedCount: number;
  totalCount: number;
  regionCount: number;
  totalRegionCount: number;
  stamps: Stamp[];
};
