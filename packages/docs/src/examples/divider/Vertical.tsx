import { Divider, Text } from "@futurewiz-rms/mint";

export default function Vertical() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 20 }}>
      <Text variant="body-4-regular" color="secondary">
        최신순
      </Text>
      <Divider orientation="vertical" />
      <Text variant="body-4-regular" color="secondary">
        인기순
      </Text>
      <Divider orientation="vertical" />
      <Text variant="body-4-regular" color="secondary">
        거래량순
      </Text>
    </div>
  );
}
