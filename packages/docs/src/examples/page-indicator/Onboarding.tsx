import { PageDots, Text } from "@futurewiz-rms/mint";

export default function Onboarding() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: 280,
      }}
    >
      <Text variant="heading-3-semibold" color="strong">
        관심 코인을 담아 보세요
      </Text>
      <PageDots current={1} total={3} />
    </div>
  );
}
