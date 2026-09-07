import { MATCHING_SERVICE_FEE } from "@/features/matching/mocks";
import type { PaymentRecord, Notice, ReportCategory } from "./types";

export const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    paymentId: "pay-1",
    courseTitle: "경주 역사 기행",
    partnerName: "이서준",
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
