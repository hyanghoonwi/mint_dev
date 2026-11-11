import { CheckMark } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 8 }}>
      <CheckMark>체크 안 됨</CheckMark>
      <CheckMark checked>체크됨</CheckMark>
      <CheckMark disabled>비활성</CheckMark>
      <CheckMark checked disabled>
        비활성 체크됨
      </CheckMark>
    </div>
  );
}
