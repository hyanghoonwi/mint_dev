import { BellIcon, IconButton } from "@futurewiz-rms/mint";

export default function Badge() {
  return <IconButton icon={<BellIcon />} aria-label="알림" badge />;
}
