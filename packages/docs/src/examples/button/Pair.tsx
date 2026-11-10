import { Button } from "@futurewiz-rms/mint";

export default function Pair() {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 375 }}>
      <div style={{ flex: 3 }}>
        <Button color="secondary" size="lg" fullWidth>
          닫기
        </Button>
      </div>
      <div style={{ flex: 7 }}>
        <Button size="lg" fullWidth>
          참여하기
        </Button>
      </div>
    </div>
  );
}
