import { Text, TextButton } from "@futurewiz-rms/mint";

export default function Inline() {
  return (
    <Text as="p" variant="body-2-regular">
      투자 위험은{" "}
      <TextButton inline size="lg" href="/notice">
        투자 유의 안내
      </TextButton>
      에서 자세히 볼 수 있어요.
    </Text>
  );
}
