export type PaymentRecord = {
  paymentId: string;
  courseTitle: string;
  partnerName: string;
  amount: number;
  paidAt: string;
  status: "결제완료" | "환불완료";
};

export type Notice = {
  noticeId: string;
  title: string;
  date: string;
  content: string;
};

export type ReportCategory = "매칭 상대" | "코스" | "결제" | "기타";
