import { MATCHING_SERVICE_FEE } from "@/features/matching/mocks";
import type { PaymentRecord, Notice, ReportCategory } from "./types";

// 결제 내역을 조회하는 GET 엔드포인트가 백엔드에 없어서(POST ready/approve/cancel만 존재)
// PaymentHistoryList가 이 mock 배열을 그대로 화면에 뿌린다 — API가 생기면 통째로 교체.
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

// 공지사항 API 자체가 없어서(전체 엔드포인트 목록에 Notice 도메인이 없음) NoticeList가
// 이 mock 배열을 고정으로 보여준다 — API가 생기면 통째로 교체.
export const NOTICES: Notice[] = [
  {
    noticeId: "notice-1",
    title: "행연 서비스 오픈 안내",
    date: "2026-08-01",
    content: "관광지를 함께 걸으며 만나는 여행 동행 매칭 앱, 행연이 오픈했어요!",
  },
];

// 실제 신고 API(POST /safety/reports)는 "매칭 상대" 신고만 지원한다(matchAttemptId 기준).
// 코스·결제·기타는 대응하는 백엔드 신고/문의 엔드포인트가 없어서 ReportForm에서 선택만
// 가능하고 실제 접수는 안 되는 비활성 카테고리로 남아있다.
export const REPORT_CATEGORIES: ReportCategory[] = ["매칭 상대", "코스", "결제", "기타"];
