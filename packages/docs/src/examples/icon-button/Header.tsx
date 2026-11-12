import { DotsThreeIcon, IconButton, ShareNetworkIcon, Text, XIcon } from "@futurewiz-rms/mint";

export default function Header() {
  return (
    <div
      className="bg-background-default rounded-16"
      style={{ display: "flex", alignItems: "center", gap: 4, width: 320, padding: "8px 12px" }}
    >
      <IconButton icon={<XIcon />} aria-label="닫기" />
      <Text variant="heading-3-semibold" color="strong" style={{ flex: 1 }}>
        비트코인
      </Text>
      <IconButton icon={<ShareNetworkIcon />} aria-label="공유" />
      <IconButton icon={<DotsThreeIcon />} aria-label="더보기" />
    </div>
  );
}
