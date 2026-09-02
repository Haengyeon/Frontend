import { CHAT_ROOMS } from "@/features/chat/mocks";
import { MATCHING_SERVICE_FEE } from "@/features/matching/mocks";
import type { PaymentRecord, Notice, ReportCategory, PointRecord } from "./types";

export const MOCK_POINTS = 1250;

export const POINT_HISTORY: PointRecord[] = [
  { pointId: "point-1", reason: "경주 역사 기행 코스 완료", amount: 500, date: "2026-08-12" },
  { pointId: "point-2", reason: "부산 야경 산책 코스 완료", amount: 750, date: "2026-08-05" },
];

export const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    paymentId: "pay-1",
    courseTitle: CHAT_ROOMS[0].courseInfo.courseTitle,
    partnerName: CHAT_ROOMS[0].partnerName,
    amount: MATCHING_SERVICE_FEE,
    paidAt: "2026-08-10",
    status: "결제완료",
  },
];

export const NOTICES: Notice[] = [
  {
    noticeId: "notice-1",
    title: "행연 서비스 오픈 안내",
    date: "2026-08-01",
    content: "관광지를 함께 걸으며 만나는 여행 동행 매칭 앱, 행연이 오픈했어요!",
  },
  {
    noticeId: "notice-2",
    title: "여름맞이 매칭 이벤트 안내",
    date: "2026-08-15",
    content: "8월 한 달간 매칭이 확정되면 지역진흥기금이 추가로 적립돼요.",
  },
];

export const REPORT_CATEGORIES: ReportCategory[] = ["매칭 상대", "코스", "결제", "기타"];
