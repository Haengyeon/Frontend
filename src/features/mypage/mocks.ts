import type { Notice, ReportCategory } from "./types";

// 결제 내역 전용 GET 엔드포인트가 백엔드에 없어서, PaymentHistoryList는 실제 코스 이력
// (GET /courses/history)에서 결제 내역을 파생시킨다 — 여기엔 mock이 필요 없다.

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
