import { Box, IconButton, ShareNetworkIcon, XIcon } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일은 촘촘하게 sm(32), 태블릿(768px~)부터 md(40)
    <Box direction="horizontal" gap={8}>
      <IconButton size={{ base: "sm", tablet: "md" }} icon={<XIcon />} aria-label="닫기" />
      <IconButton
        size={{ base: "sm", tablet: "md" }}
        icon={<ShareNetworkIcon />}
        aria-label="공유"
      />
    </Box>
  );
}
