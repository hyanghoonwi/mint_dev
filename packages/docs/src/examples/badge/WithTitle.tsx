import { Badge, Text } from "@futurewiz-rms/mint";

export default function WithTitle() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Text as="strong" variant="heading-2-bold" color="strong">
        비트코인 리포트
      </Text>
      <Badge>NEW</Badge>
    </div>
  );
}
