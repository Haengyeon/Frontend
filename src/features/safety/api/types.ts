// public/img/API명세_신고차단알림.md + 실서버(/api-json) 기준.
// 문서엔 5개뿐이지만 실서버 enum엔 SEXUAL_HARASSMENT가 하나 더 있다 — 실서버 쪽을 따른다.
export type ReportReasonCode =
  | "INAPPROPRIATE_PROFILE"
  | "NO_SHOW"
  | "ABUSE_HARASSMENT"
  | "SEXUAL_HARASSMENT"
  | "SUSPECTED_FRAUD"
  | "OTHER";

export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED";

export type SafetyUser = {
  userId: string;
  /** 프로필이 없는 계정이면 "알 수 없음" */
  name: string;
  /** 프로필이 없는 계정이면 빈 문자열 */
  profileImageUrl: string;
};

export type CreateReportRequest = {
  matchAttemptId: string;
  reasonCode: ReportReasonCode;
  /** 500자 이내, 선택 입력 */
  description?: string;
};

export type Report = {
  reportId: string;
  matchAttemptId: string;
  reportedUser: SafetyUser;
  /** 분기 처리용 코드. 화면에 그대로 쓰지 말 것 */
  reasonCode: ReportReasonCode;
  /** 화면에 그대로 쓰는 한글 문구 — 서버가 내려주므로 FE에 매핑 테이블을 두지 않는다 */
  reason: string;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
};

export type ReportListResponse = {
  items: Report[];
};

export type Block = {
  blockId: string;
  blockedUser: SafetyUser;
  createdAt: string;
};

export type BlockListResponse = {
  items: Block[];
};
