import { Circular, Text } from "@futurewiz-rms/mint";

export default function Section() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        width: 280,
        padding: 32,
      }}
      className="bg-background-default rounded-16"
    >
      <Circular color="brand" />
      <Text variant="body-4-regular" color="tertiary">
        시세를 불러오고 있어요
      </Text>
    </div>
  );
}
