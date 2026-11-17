import { Text } from "@futurewiz-rms/mint";

export default function Usage() {
  return (
    <>
      <Text variant="title-2-bold" as="h2">
        오늘의 시세
      </Text>
      <Text variant="body-2-regular" color="secondary" as="p">
        스타일 하나로 크기, 줄 간격, 자간, 굵기가 함께 정해져요.
      </Text>
      <Text variant="caption-1-regular" color="tertiary">
        2026-10-28 업데이트
      </Text>
    </>
  );
}
