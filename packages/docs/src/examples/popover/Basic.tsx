"use client";
import { Box, Button, Checkbox, FunnelIcon, Popover, Text } from "@futurewiz-rms/mint";

// trigger 함수가 받은 속성을 버튼에 넘겨요. 바깥을 누르거나 Esc를 누르면 닫혀요
export default function Basic() {
  return (
    <Popover
      trigger={(props) => (
        <Button variant="outline" color="neutral" leftAddon={<FunnelIcon />} {...props}>
          필터
        </Button>
      )}
      aria-label="필터"
    >
      <Box gap={8}>
        <Text variant="label-2-semibold">시장</Text>
        <Checkbox defaultChecked>원화</Checkbox>
        <Checkbox>BTC</Checkbox>
        <Checkbox>USDT</Checkbox>
      </Box>
    </Popover>
  );
}
