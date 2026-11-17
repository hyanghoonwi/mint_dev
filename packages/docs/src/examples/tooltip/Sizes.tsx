import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "64px 16px" }}>
      <Tooltip size="sm" label="역할" open>
        <Button color="secondary" size="sm">
          sm
        </Button>
      </Tooltip>
      <Tooltip size="md" label="역할" open>
        <Button color="secondary" size="sm">
          md
        </Button>
      </Tooltip>
      <Tooltip size="lg" label="역할" open>
        <Button color="secondary" size="sm">
          lg
        </Button>
      </Tooltip>
    </div>
  );
}
