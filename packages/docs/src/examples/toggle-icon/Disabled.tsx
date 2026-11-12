import { StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Disabled() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" disabled />
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" defaultActive disabled />
    </div>
  );
}
