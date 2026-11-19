import { StarIcon, Toast } from "@futurewiz-rms/mint";

// icon={false}면 아이콘이 없고, 아이콘을 넘기면 종류별 아이콘 대신 그 아이콘이 보여요
export default function Icon() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}
    >
      <Toast>종류에 맞는 아이콘이에요.</Toast>
      <Toast icon={false}>아이콘 없이 글자만 보여요.</Toast>
      <Toast icon={<StarIcon variant="fill" />}>관심 코인에 담았어요.</Toast>
    </div>
  );
}
