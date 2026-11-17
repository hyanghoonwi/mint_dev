import { IconButton, ShareNetworkIcon, Tooltip } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 아래(bottom)·sm, 데스크톱(1024px~)부터 오른쪽(right)·md
    <Tooltip
      size={{ base: "sm", desktop: "md" }}
      label="공유"
      open
      position={{ base: "bottom", desktop: "right" }}
    >
      <IconButton variant="background" icon={<ShareNetworkIcon />} aria-label="공유" />
    </Tooltip>
  );
}
