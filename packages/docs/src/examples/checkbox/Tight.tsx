import { Box, Checkbox } from "@futurewiz-rms/mint";

export default function Tight() {
  return (
    <Box gap={12}>
      <Checkbox defaultChecked tight>
        거래 체결 알림
      </Checkbox>
      <Checkbox tight>입출금 알림</Checkbox>
      <Checkbox tight>가격 도달 알림</Checkbox>
    </Box>
  );
}
