import { Snackbar } from "@futurewiz-rms/mint";

export default function Variants() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 356 }}
    >
      <Snackbar icon heading="알림을 켰어요." />
      <Snackbar icon variant="positive" heading="저장했어요." />
      <Snackbar icon variant="cautionary" heading="네트워크가 느려요." />
      <Snackbar icon variant="negative" heading="저장하지 못했어요." />
    </div>
  );
}
