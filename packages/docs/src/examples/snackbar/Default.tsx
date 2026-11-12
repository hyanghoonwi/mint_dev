import { Snackbar } from "@futurewiz-rms/mint";

export default function Default() {
  return (
    <div style={{ width: "100%", maxWidth: 356 }}>
      <Snackbar heading="메시지에 마침표를 찍어요." description="설명은 필요할 때만 써요." />
    </div>
  );
}
