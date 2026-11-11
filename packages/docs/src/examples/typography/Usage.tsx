import { Text } from "@futurewiz-rms/mint";

export default function Usage() {
  return (
    <>
      <Text as="h2" variant="title-2-bold">
        오늘의 시세
      </Text>
      <Text as="p" variant="body-2-regular" color="secondary">
        스타일 하나로 크기, 줄 간격, 자간, 굵기가 함께 정해져요.
      </Text>
      <Text variant="caption-1-regular" color="tertiary">
        2026-10-28 업데이트
      </Text>
    </>
  );
}
