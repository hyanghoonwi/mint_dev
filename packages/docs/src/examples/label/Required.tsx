import { Box, Label } from "@futurewiz-rms/mint";

export default function Required() {
  return (
    <Box direction="horizontal" gap={24}>
      <Label required>이름</Label>
      <Label>닉네임</Label>
    </Box>
  );
}
