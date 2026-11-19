import { Toast } from "@futurewiz-rms/mint";

// 버튼이 필요하면 action으로 더해요: ghost는 글자만, button은 배경이 있어요. 버튼 글자는 actionLabel로 줘요
export default function Action() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}
    >
      <Toast action="ghost" actionLabel="되돌리기">
        삭제했어요.
      </Toast>
      <Toast variant="negative" action="button" actionLabel="다시 시도">
        저장하지 못했어요.
      </Toast>
      <Toast variant="positive" shape="pill" action="ghost" actionLabel="보기">
        업로드했어요.
      </Toast>
    </div>
  );
}
