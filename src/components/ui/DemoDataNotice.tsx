// 시연용 계정의 프로필 사진·이름은 실제 인물과 무관한 가상 데이터다.
// 화면에 상대 프로필이 노출되는 (main) 영역 전반에 작게 고지한다.
export default function DemoDataNotice() {
  return (
    <p className="pointer-events-none fixed bottom-[72px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/70 px-3 py-1 text-[10px] text-white">
      ※ 사진·이름은 시연을 위한 가상 데이터입니다
    </p>
  );
}
