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
      <Text as="h3" variant="heading-3-semibold" color="strong">
        오늘의 뉴스
      </Text>
      <TextButton href="/news" color="neutral" size="sm" rightAddon={<CaretRightIcon />}>
        전체 보기
      </TextButton>
    </div>
  );
}
