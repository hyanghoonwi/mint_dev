import { Divider, Text } from "@futurewiz-rms/mint";

export default function Section() {
  return (
    <div style={{ width: 320, background: "var(--mint-background-default)" }}>
      <div className="p-5">
        <Text as="p" variant="heading-3-semibold" color="strong">
          내 자산
        </Text>
        <Text as="p" variant="body-3-regular" color="tertiary">
          총 12,450,000원
        </Text>
      </div>
      <Divider variant="thick" />
      <div className="p-5">
        <Text as="p" variant="heading-3-semibold" color="strong">
          관심 코인
        </Text>
        <Text as="p" variant="body-3-regular" color="tertiary">
          비트코인 외 3개
        </Text>
      </div>
    </div>
  );
}
