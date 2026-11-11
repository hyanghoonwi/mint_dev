import { Text } from "@futurewiz-rms/mint";

export default function Colors() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Text variant="body-2-semibold" color="strong">
        strong · 가장 진한 글자
      </Text>
      <Text variant="body-2-regular" color="primary">
        primary · 기본 글자
      </Text>
      <Text variant="body-2-regular" color="secondary">
        secondary · 보조 글자
      </Text>
      <Text variant="body-2-regular" color="tertiary">
        tertiary · 설명, 날짜
      </Text>
      <Text variant="body-2-regular" color="danger">
        danger · 오류
      </Text>
    </div>
  );
}
