import { Text } from "@futurewiz-rms/mint";

export default function Headings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 320 }}>
      <Text variant="title-2-bold" as="h1">
        내 자산
      </Text>
      <Text variant="body-3-regular" as="p" color="secondary">
        오늘 오후 3시 기준이에요
      </Text>
    </div>
  );
}
