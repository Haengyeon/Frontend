"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MatchConfirmedBadge from "@/features/matching/components/MatchConfirmedBadge";
import { useCurrentCourse } from "@/features/course/api/useCourseApi";
import { useChatRoomHistory } from "@/features/chat/api/useChatApi";

export default function MatchConfirmedSummary() {
  const router = useRouter();
  const { data } = useCurrentCourse();
  const course = data?.course;
  const { data: chatRooms } = useChatRoomHistory();
  // 이 매칭에 연결된 채팅방을 찾는다 — matchAttemptId로 못 찾으면(로딩 중 등)
  // LOCKED·OPEN 중인 방(진행 중인 매칭엔 그런 방이 최대 1개뿐)으로 한 번 더 찾아본다.
  const activeChatRoom =
    chatRooms?.rooms.find((room) => room.matchAttemptId === course?.matchAttemptId) ??
    chatRooms?.rooms.find((room) => room.status === "LOCKED" || room.status === "OPEN");
  const dDay = course?.dday ?? null;
  // 스탬프·코스 화면과 같은 시군구 단위로 보여준다 — "전북"이 아니라 "전북 남원시".
  const location = course
    ? [course.regionLabel, ...course.sigunguNames].join(" ")
    : "여행지 미정";

  return (
    <div className="flex flex-col items-center gap-4 px-6 text-center">
      <MatchConfirmedBadge />
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-ink">매칭이 확정되었어요!</p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">
            {dDay === null
              ? "일정 미정"
              : dDay === 0
                ? "D-DAY"
                : `D${dDay > 0 ? "-" : "+"}${Math.abs(dDay)}`}
          </span>
          <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">
            {location}
          </span>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(activeChatRoom ? `/chat/${activeChatRoom.id}` : "/chat")}
        >
          채팅하기
        </Button>
        <Button className="flex-1" onClick={() => router.push("/course")}>
          코스 보기
        </Button>
      </div>
    </div>
  );
}
