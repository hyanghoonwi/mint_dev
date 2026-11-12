import { Toast } from "@futurewiz-rms/mint";

export default function Shapes() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}
    >
      <Toast variant="positive">저장했어요.</Toast>
      <Toast variant="positive" shape="pill">
        저장했어요.
      </Toast>
    </div>
  );
}
