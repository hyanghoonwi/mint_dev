import { Text, TextButton } from "@futurewiz-rms/mint";

export default function Inline() {
  return (
    <Text variant="body-2-regular" as="p">
      투자 위험은{" "}
      <TextButton size="lg" inline href="/notice">
        투자 유의 안내
      </TextButton>
      에서 자세히 볼 수 있어요.
    </Text>
  );
}
