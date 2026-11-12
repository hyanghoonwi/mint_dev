import { CaretRightIcon, PlusIcon, TextButton } from "@futurewiz-rms/mint";

export default function Addons() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <TextButton leftAddon={<PlusIcon />}>관심 코인 추가</TextButton>
      <TextButton href="/news" rightAddon={<CaretRightIcon />}>
        전체 보기
      </TextButton>
    </div>
  );
}
