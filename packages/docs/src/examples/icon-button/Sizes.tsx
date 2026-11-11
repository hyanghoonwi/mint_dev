import { IconButton, PlusIcon } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" size="lg" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" size="md" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" size="sm" />
      <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" size="xs" />
    </div>
  );
}
