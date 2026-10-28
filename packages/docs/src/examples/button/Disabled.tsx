import { Button } from "@futurewiz-rms/mint";

export default function Disabled() {
  return (
    <>
      <Button disabled>primary</Button>
      <Button variant="line" disabled>
        line
      </Button>
    </>
  );
}
