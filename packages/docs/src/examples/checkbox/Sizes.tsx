import { Checkbox } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <>
      <Checkbox size="xs" defaultChecked>
        XSmall 16
      </Checkbox>
      <Checkbox size="sm" defaultChecked>
        Small 20
      </Checkbox>
      <Checkbox size="md" defaultChecked>
        Medium 24
      </Checkbox>
      <Checkbox size="lg" defaultChecked>
        Large 32
      </Checkbox>
    </>
  );
}
