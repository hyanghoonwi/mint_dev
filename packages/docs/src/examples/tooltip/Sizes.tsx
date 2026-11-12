import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "64px 16px" }}>
      <Tooltip label="역할" size="sm" open>
        <Button size="sm" color="secondary">
          sm
        </Button>
      </Tooltip>
      <Tooltip label="역할" size="md" open>
        <Button size="sm" color="secondary">
          md
        </Button>
      </Tooltip>
      <Tooltip label="역할" size="lg" open>
        <Button size="sm" color="secondary">
          lg
        </Button>
      </Tooltip>
    </div>
  );
}
