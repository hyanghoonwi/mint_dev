import { Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function Tight() {
  return (
    <RadioGroup aria-label="표시 통화" defaultValue="KRW" style={{ gap: 12 }}>
      <Radio value="KRW" tight>
        KRW
      </Radio>
      <Radio value="USD" tight>
        USD
      </Radio>
      <Radio value="BTC" tight>
        BTC
      </Radio>
    </RadioGroup>
  );
}
