import { Box, Textarea } from "@futurewiz-rms/mint";

export default function LabelPosition() {
  return (
    <Box gap={24}>
      <Textarea label="위" placeholder="내용을 입력해 주세요" />
      <Textarea label="왼쪽" placeholder="내용을 입력해 주세요" labelPosition="left" />
    </Box>
  );
}
