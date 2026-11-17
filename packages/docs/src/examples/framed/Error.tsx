import { FramedRadio, RadioGroup, Text } from "@futurewiz-rms/mint";

export default function Error() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 360, maxWidth: "100%" }}>
      <RadioGroup aria-describedby="verify-error" aria-label="본인 인증 방법" className="gap-2">
        <FramedRadio label="휴대폰 인증" value="phone" error />
        <FramedRadio label="신용카드 인증" value="card" error />
      </RadioGroup>
      <Text variant="body-5-regular" color="danger" id="verify-error">
        인증 방법을 골라 주세요
      </Text>
    </div>
  );
}
