import { Radio, RadioGroup } from "@futurewiz-rms/mint";

const sizes = [
  ["xs", "XSmall 16"],
  ["sm", "Small 20"],
  ["md", "Medium 24"],
  ["lg", "Large 32"],
] as const;

export default function Sizes() {
  return (
    <>
      {sizes.map(([size, label]) => (
        <RadioGroup key={size} aria-label={label} defaultValue="on" size={size}>
          <Radio value="on">{label}</Radio>
        </RadioGroup>
      ))}
    </>
  );
}
