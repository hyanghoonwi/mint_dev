import { IconButton, PlusIcon } from "@futurewiz-rms/mint";

export default function Variants() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <IconButton icon={<PlusIcon />} aria-label="추가" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="outline" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="solid" />
    </div>
  );
}
