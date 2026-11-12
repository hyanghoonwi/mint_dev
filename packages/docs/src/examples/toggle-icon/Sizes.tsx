import { StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" size="lg" defaultActive />
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" size="md" defaultActive />
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" size="sm" defaultActive />
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" size="xs" defaultActive />
    </div>
  );
}
