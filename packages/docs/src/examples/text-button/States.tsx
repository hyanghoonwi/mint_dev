import { CaretRightIcon, TextButton } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <TextButton underline rightAddon={<CaretRightIcon />}>
        더 보기
      </TextButton>
      <TextButton disabled>더 보기</TextButton>
      <TextButton loading>더 보기</TextButton>
    </div>
  );
}
