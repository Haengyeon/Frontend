// [개발용] 좌측 패널에서 각 단계 버튼을 누르면 뜨는 화면 미리보기.
//
// 실제 API/DB를 전혀 안 건드린다 — 전부 이 파일 안의 고정된 mock 데이터로만 그린다.
// 그래서 시드 계정이 다른 매칭에 걸려있거나 카카오 결제를 거쳐야 하는 것과 무관하게
// 항상 즉시, 100% 예측 가능하게 그 단계의 UI를 보여준다. 대신 실제 데이터는 하나도
// 아니라서 "진짜 이 상태로 만들었을 때 API가 이렇게 내려주는지"는 검증하지 못한다 —
// 그건 실제 매칭 플로우를 직접 밟아보는 것으로만 확인할 수 있다.
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Check, X, Heart, CalendarHeart, Clover, Hourglass, Camera, CheckCircle2, Lock } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";

const MOCK_PARTNER = {
  name: "유지민",
  age: 26,
  job: "디자이너",
  mbti: "ENFP",
  intro: "안녕하세요? 반가워요! 좋은 사람이에요",
  hobbies: ["사진찍기", "독서", "카페투어"],
  photoUrl: "/유지민.png",
  fullBodyPhotoUrl: "/유지민_전신.png",
};

const MOCK_SPOTS = [
  { name: "경복궁", area: "서울 종로구", imageUrl: "/경복궁.png", desc: "조선 시대의 정궁으로 아름다운 전통 건축을 볼 수 있어요." },
  { name: "국립중앙박물관", area: "서울 용산구", imageUrl: "/국립중앙박물관.png", desc: "한국을 대표하는 역사·문화 유물을 만날 수 있어요." },
  { name: "북촌한옥마을", area: "서울 종로구", imageUrl: "/북촌한옥마을.png", desc: "한옥이 밀집된 전통 마을로 골목 산책하기 좋아요." },
  { name: "창덕궁", area: "서울 종로구", imageUrl: "/창덕궁.png", desc: "자연과 건축이 조화를 이루는 아름다운 궁궐이에요." },
];

function MockScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex h-14 shrink-0 items-center border-b border-line px-4">
        <h1 className="text-base font-medium text-ink">{title}</h1>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function NoMatch() {
  return (
    <MockScreen title="홈">
      <div className="relative mx-6 mt-4 overflow-hidden rounded-3xl bg-forest-light p-6">
        <div className="absolute -right-6 -top-10 h-28 w-28 rounded-full bg-forest/10" />
        <div className="relative flex flex-col gap-3">
          <span className="text-xs font-medium text-forest">행연 · 여행 동행</span>
          <h2 className="text-xl font-semibold leading-snug text-ink">
            새로운 곳에서
            <br />
            새로운 인연을 만나볼까요?
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            관광지를 함께 걸으며 취향이 맞는 동행을 찾아보세요.
          </p>
          <Button className="mt-2 px-6">매칭 시작하기</Button>
        </div>
      </div>
    </MockScreen>
  );
}

function Searching() {
  return (
    <MockScreen title="홈">
      <div className="mx-6 mt-4 flex flex-col items-center gap-6 rounded-3xl bg-forest-light px-6 py-12">
        <Heart size={36} className="text-forest" fill="currentColor" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-base font-semibold text-forest">당신의 새 인연을 찾고 있어요!</p>
          <p className="text-sm text-forest/70">잠시만 기다려주세요</p>
        </div>
      </div>
    </MockScreen>
  );
}

function Found() {
  return (
    <MockScreen title="홈">
      <div className="mx-6 mt-4 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-forest/20" />
          <p className="shrink-0 text-lg font-semibold text-forest">새로운 인연이 매칭되었어요!</p>
          <span className="h-px flex-1 bg-forest/20" />
        </div>
        <Avatar src={MOCK_PARTNER.photoUrl} alt={MOCK_PARTNER.name} size={104} />
        <p className="text-sm text-forest/70">
          {MOCK_PARTNER.age}세 · {MOCK_PARTNER.job}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {MOCK_PARTNER.hobbies.map((hobby) => (
            <Badge key={hobby} className="bg-pink-50 text-forest">
              #{hobby}
            </Badge>
          ))}
        </div>
        <Button className="mt-2 px-6">프로필 보러가기</Button>
      </div>
    </MockScreen>
  );
}

function Profile() {
  return (
    <MockScreen title="매칭 상대">
      <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-forest-light to-forest/50">
          <Image src={MOCK_PARTNER.fullBodyPhotoUrl} alt={MOCK_PARTNER.name} fill sizes="400px" className="object-cover" />
          <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs text-ink">
            최근 접속
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12">
            <p className="text-lg font-semibold text-white">
              {MOCK_PARTNER.name}{" "}
              <span className="text-sm font-normal text-white/85">
                {MOCK_PARTNER.age}세 · {MOCK_PARTNER.job} · {MOCK_PARTNER.mbti}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MOCK_PARTNER.hobbies.map((hobby) => (
                <span key={hobby} className="rounded-full bg-white/25 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  #{hobby}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-sm leading-relaxed text-ink">{MOCK_PARTNER.intro}</p>
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-ink">
          <span className="flex items-center gap-1">
            <CalendarHeart size={14} strokeWidth={1.5} className="text-forest" />
            9월 20일 (토)
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1">
            <Clover size={14} strokeWidth={1.5} className="text-forest" />
            역사 문화
          </span>
        </div>
        <div className="mt-auto flex items-center justify-center gap-8">
          <button type="button" className="flex flex-col items-center gap-1.5 text-muted">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream-card">
              <X size={24} strokeWidth={1.5} />
            </span>
            <span className="text-xs">거절</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-forest">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
              <Heart size={24} strokeWidth={1.5} fill="currentColor" />
            </span>
            <span className="text-xs">수락</span>
          </button>
        </div>
      </div>
    </MockScreen>
  );
}

function Pending() {
  const [deadlineAt] = useState(() => Date.now() + 12 * 60 * 60 * 1000);
  return (
    <MockScreen title="매칭 응답 대기">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-light">
          <Hourglass size={28} strokeWidth={1.5} className="text-forest" />
        </div>
        <p className="text-base font-semibold text-ink">매칭 접수가 완료됐어요!</p>
        <p className="text-sm text-muted">
          상대방의 응답을 기다리고 있어요.
          <br />
          응답이 오면 알림으로 알려드릴게요.
        </p>
        <p className="text-sm font-medium text-forest">
          <Countdown deadlineAt={deadlineAt} /> 남음
        </p>
        <p className="text-xs text-muted">12시간 이내에 상대방이 응답하지 않으면 매칭이 자동으로 취소돼요.</p>
        <Button variant="secondary" className="mt-4 px-6">
          홈으로 가기
        </Button>
      </div>
    </MockScreen>
  );
}

function Payment() {
  const [deadlineAt] = useState(() => Date.now() + 6 * 60 * 60 * 1000);
  return (
    <MockScreen title="결제">
      <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
          <Avatar src={MOCK_PARTNER.fullBodyPhotoUrl} alt={MOCK_PARTNER.name} size={48} />
          <div>
            <p className="text-sm font-semibold text-ink">{MOCK_PARTNER.name}</p>
            <p className="text-xs text-muted">
              {MOCK_PARTNER.age}세 · {MOCK_PARTNER.job}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
          <div className="flex items-center gap-2 text-sm">
            <CalendarHeart size={16} strokeWidth={1.5} className="text-forest" />
            <span className="text-muted">여행 날짜</span>
            <span className="ml-auto font-medium text-ink">9월 20일 (토)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clover size={16} strokeWidth={1.5} className="text-forest" />
            <span className="text-muted">결정된 테마</span>
            <span className="ml-auto font-medium text-ink">역사 문화</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
          <div className="flex items-center justify-between text-base font-semibold">
            <span className="text-ink">결제 금액 (부가세 포함)</span>
            <span className="text-forest">25,000원</span>
          </div>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <p className="text-xs text-muted">
            <Countdown deadlineAt={deadlineAt} /> 이내에 결제하지 않으면 매칭이 자동으로 취소돼요.
          </p>
          <Button variant="kakao" className="w-full">
            카카오페이로 결제하기
          </Button>
        </div>
      </div>
    </MockScreen>
  );
}

function Confirmed() {
  return (
    <MockScreen title="홈">
      <div className="mt-6 flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative mx-auto flex h-28 w-48 items-center justify-center">
          <Avatar alt="나" size={96} className="absolute left-0 border-4 border-cream" />
          <Avatar src={MOCK_PARTNER.photoUrl} alt={MOCK_PARTNER.name} size={96} className="absolute right-0 border-4 border-cream" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-ink">매칭이 확정되었어요!</p>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">D-11</span>
            <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest">서울</span>
          </div>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="secondary" className="flex-1">
            채팅하기
          </Button>
          <Button className="flex-1">코스 보기</Button>
        </div>
      </div>
    </MockScreen>
  );
}

function Completed() {
  return (
    <MockScreen title="홈">
      <div className="mt-6 flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative mx-auto flex h-28 w-48 items-center justify-center">
          <Avatar alt="나" size={96} className="absolute left-0 border-4 border-cream" />
          <Avatar src={MOCK_PARTNER.photoUrl} alt={MOCK_PARTNER.name} size={96} className="absolute right-0 border-4 border-cream" />
          <span className="absolute bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white ring-4 ring-cream">
            <Check size={16} strokeWidth={2.5} />
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-semibold text-ink">여행이 완료되었어요!</p>
          <p className="text-sm text-muted">함께한 여행은 어떠셨나요?</p>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="secondary" className="flex-1">
            후기 작성하기
          </Button>
          <Button className="flex-1">다시 매칭하기</Button>
        </div>
      </div>
    </MockScreen>
  );
}

function CourseLocked() {
  return (
    <MockScreen title="코스">
      <div className="flex flex-col gap-4 p-6">
        <p className="text-center text-base font-semibold text-ink">
          코스 세부 일정은 만나기 하루 전(D-1)부터 확인할 수 있어요
        </p>
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">지역</span>
            <span className="ml-auto font-medium text-ink">서울</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">테마</span>
            <span className="ml-auto font-medium text-ink">역사 문화</span>
          </div>
        </div>
      </div>
    </MockScreen>
  );
}

function CoursePreviewD1() {
  return (
    <MockScreen title="코스">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Lock size={13} strokeWidth={1.5} />
            코스 세부 일정은 당일에 공개돼요
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">지역</span>
            <span className="ml-auto font-medium text-ink">서울</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">테마</span>
            <span className="ml-auto font-medium text-ink">역사 문화</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">예상 소요 시간</span>
            <span className="ml-auto font-medium text-ink">5시간 30분</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">복장 추천</span>
            <span className="ml-auto font-medium text-ink">걷기 편한 신발을 추천해요</span>
          </div>
        </div>
      </div>
    </MockScreen>
  );
}

function CourseFull() {
  const selected = MOCK_SPOTS[0];
  return (
    <MockScreen title="코스">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-1.5">
          {MOCK_SPOTS.map((spot, i) => (
            <div
              key={spot.name}
              className={`flex min-w-0 flex-col overflow-hidden rounded-2xl ${i === 0 ? "flex-[2] border-2 border-forest" : "flex-1"}`}
            >
              <div className="relative aspect-[3/5] w-full bg-forest-light">
                <Image src={spot.imageUrl} alt={spot.name} fill sizes="200px" className="object-cover" />
                <span className="absolute right-1.5 top-1.5 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-ink shadow-sm">
                  {i + 1}/{MOCK_SPOTS.length}
                </span>
              </div>
              <div className="bg-white px-2 py-3 text-center">
                {i === 0 ? (
                  <>
                    <p className="text-base font-semibold text-ink">{spot.name}</p>
                    <p className="text-xs text-muted">{spot.area}</p>
                  </>
                ) : (
                  <p className="truncate text-xs font-medium text-ink">{spot.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest-light">
              <Image src={selected.imageUrl} alt={selected.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-ink">{selected.name}</p>
              <p className="text-sm text-muted">{selected.area}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink/80">{selected.desc}</p>
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                <Camera size={16} strokeWidth={1.5} />
                사진 미션
              </span>
              <p className="text-xs leading-relaxed text-muted">경복궁을 배경으로 인증샷을 남겨보세요.</p>
              <p className="text-xs text-muted">상대방 인증샷 완료</p>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-forest-light px-6 py-4 text-forest">
              <CheckCircle2 size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium">완료!</span>
            </div>
          </div>
        </div>

        <Button className="w-full">후기 작성하기</Button>
      </div>
    </MockScreen>
  );
}

function CourseNone() {
  return (
    <MockScreen title="코스">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-sm font-medium text-ink">진행중인 코스가 없어요</p>
      </div>
    </MockScreen>
  );
}

export const MOCK_MATCHING_STAGES = [
  { key: "none", label: "노매칭" },
  { key: "searching", label: "탐색중" },
  { key: "found", label: "매칭 발견" },
  { key: "profile", label: "상대 프로필" },
  { key: "pending", label: "매칭 응답 대기 (12h)" },
  { key: "payment", label: "결제 (6h)" },
  { key: "confirmed", label: "확정" },
  { key: "completed", label: "완료" },
] as const;

export const MOCK_COURSE_STAGES = [
  { key: "course-full", label: "코스 전체공개 (D-Day)" },
  { key: "course-preview", label: "코스 소요시간·복장 (D-1)" },
  { key: "course-locked", label: "코스 지역·테마만 (D-5)" },
  { key: "course-none", label: "코스 없음 (매칭 안 됨)" },
] as const;

export type MockStageKey =
  | (typeof MOCK_MATCHING_STAGES)[number]["key"]
  | (typeof MOCK_COURSE_STAGES)[number]["key"];

export function DevMockStageScreen({ stageKey }: { stageKey: MockStageKey }) {
  switch (stageKey) {
    case "none":
      return <NoMatch />;
    case "searching":
      return <Searching />;
    case "found":
      return <Found />;
    case "profile":
      return <Profile />;
    case "pending":
      return <Pending />;
    case "payment":
      return <Payment />;
    case "confirmed":
      return <Confirmed />;
    case "completed":
      return <Completed />;
    case "course-full":
      return <CourseFull />;
    case "course-preview":
      return <CoursePreviewD1 />;
    case "course-locked":
      return <CourseLocked />;
    case "course-none":
      return <CourseNone />;
  }
}
