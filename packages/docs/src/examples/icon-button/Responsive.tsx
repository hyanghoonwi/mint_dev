import { IconButton, ShareNetworkIcon, XIcon } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일은 촘촘하게 sm(32), 태블릿(768px~)부터 md(40)
    <div style={{ display: "flex", gap: 8 }}>
      <IconButton icon={<XIcon />} aria-label="닫기" size={{ base: "sm", tablet: "md" }} />
      <IconButton
        icon={<ShareNetworkIcon />}
        aria-label="공유"
        size={{ base: "sm", tablet: "md" }}
      />
    </div>
  );
}
