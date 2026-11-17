import { CaretRightIcon, Text, TextButton } from "@futurewiz-rms/mint";

export default function ViewAll() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text variant="heading-3-semibold" color="strong" as="h3">
        오늘의 뉴스
      </Text>
      <TextButton color="neutral" size="sm" rightAddon={<CaretRightIcon />} href="/news">
        전체 보기
      </TextButton>
    </div>
  );
}
