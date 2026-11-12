import { BookmarkSimpleIcon, IconButton, ShareNetworkIcon, Tooltip } from "@futurewiz-rms/mint";

export default function IconButtonExample() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Tooltip label="공유">
        <IconButton icon={<ShareNetworkIcon />} aria-label="공유" />
      </Tooltip>
      <Tooltip label="저장">
        <IconButton icon={<BookmarkSimpleIcon />} aria-label="저장" />
      </Tooltip>
    </div>
  );
}
