import { Box, Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <Box direction="horizontal" gap={24}>
      <RadioGroup defaultValue="on" aria-label="기본">
        <Radio value="off">안 고름</Radio>
        <Radio value="on">고름</Radio>
      </RadioGroup>
      <RadioGroup defaultValue="on" disabled aria-label="비활성">
        <Radio value="off">비활성</Radio>
        <Radio value="on">비활성 고름</Radio>
      </RadioGroup>
    </Box>
  );
}
