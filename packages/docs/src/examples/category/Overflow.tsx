import { Category } from "@futurewiz-rms/mint";

export default function Overflow() {
  return (
    <Category
      aria-label="코인 분류"
      shape="pill"
      items={[
        { value: "major", label: "메이저" },
        { value: "defi", label: "디파이" },
        { value: "meme", label: "밈" },
        { value: "layer2", label: "레이어2" },
        { value: "ai", label: "AI" },
        { value: "game", label: "게임" },
      ]}
      style={{ width: 320, maxWidth: "100%" }}
    />
  );
}
