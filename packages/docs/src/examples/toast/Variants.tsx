import { Toast } from "@futurewiz-rms/mint";

export default function Variants() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}
    >
      <Toast>알림을 켰어요.</Toast>
      <Toast variant="positive">저장했어요.</Toast>
      <Toast variant="cautionary">네트워크가 느려요.</Toast>
      <Toast variant="negative">저장하지 못했어요.</Toast>
    </div>
  );
}
