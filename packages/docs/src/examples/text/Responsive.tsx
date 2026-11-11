import { Text } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일 Title 3(24px) → 데스크톱(1024px~) Title 1(32px). 같은 크기 표 안에서 스타일만 바꿔요
    <Text variant={{ base: "title-3-bold", desktop: "title-1-bold" }} as="h1">
      내 자산
    </Text>
  );
}
