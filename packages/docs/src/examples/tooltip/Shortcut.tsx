import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function Shortcut() {
  return (
    <Tooltip label="⌘C" open>
      <Button color="secondary">복사</Button>
    </Tooltip>
  );
}
