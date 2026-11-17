"use client";
import { Button, DotsThreeIcon, IconButton, Popover, Text } from "@futurewiz-rms/mint";

// 화면 오른쪽에 있는 버튼은 placement="bottom-end"로 오른쪽 끝을 맞춰요
export default function PlacementEnd() {
  return (
    <Popover
      trigger={(props) => <IconButton icon={<DotsThreeIcon />} aria-label="더보기" {...props} />}
      placement="bottom-end"
      aria-label="더보기"
    >
      <Text variant="body-3-regular" color="secondary" as="p">
        알림 설정은 내 정보에서 바꿀 수 있어요.
      </Text>
      <Button variant="ghost" size="sm">
        내 정보로 가기
      </Button>
    </Popover>
  );
}
