import { MOCK_MATCH_PROFILE } from "@/features/matching/mocks";
import type { ChatRoomSummary, ChatMessage, ChatCourseInfo } from "./types";

const CHAT_1_MESSAGES: ChatMessage[] = [
  { id: "msg-1", senderId: "partner", content: "안녕하세요! 잘 부탁드려요 :)", sentAt: "" },
  { id: "msg-2", senderId: "me", content: "네 반갑습니다! 이번 코스 정말 기대되네요", sentAt: "" },
  { id: "msg-3", senderId: "partner", content: "저도요! 당일에 몇 시쯤 만나면 좋을까요?", sentAt: "" },
];

const CHAT_1_COURSE_INFO: ChatCourseInfo = {
  courseTitle: "경주 역사 기행",
  modeLabel: "실내 · 도보",
  durationLabel: "3시간 소요",
  stopOrder: ["코스1", "코스2", "코스3", "코스4"],
};

const CHAT_2_MESSAGES: ChatMessage[] = [
  { id: "msg-1", senderId: "partner", content: "여행 정말 즐거웠어요!", sentAt: "" },
  { id: "msg-2", senderId: "me", content: "덕분에 즐거운 여행이었어요, 다음에 또 만나요!", sentAt: "" },
];

const CHAT_2_COURSE_INFO: ChatCourseInfo = {
  courseTitle: "부산 야경 산책",
  modeLabel: "야외 · 도보",
  durationLabel: "2시간 소요",
  stopOrder: ["코스1", "코스2", "코스3"],
};

export const CHAT_ROOMS: ChatRoomSummary[] = [
  {
    chatId: "chat-1",
    partnerName: MOCK_MATCH_PROFILE.name,
    partnerPhotoUrl: MOCK_MATCH_PROFILE.photoUrl,
    lastMessage: "이번 주말 기대되네요! 몇 시에 만날까요?",
    isPast: false,
    messages: CHAT_1_MESSAGES,
    courseInfo: CHAT_1_COURSE_INFO,
  },
  {
    chatId: "chat-2",
    partnerName: "이서준",
    partnerPhotoUrl: "",
    lastMessage: "덕분에 즐거운 여행이었어요, 다음에 또 만나요!",
    isPast: true,
    messages: CHAT_2_MESSAGES,
    courseInfo: CHAT_2_COURSE_INFO,
  },
];
