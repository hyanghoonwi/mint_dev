import { PageDots } from "@futurewiz-rms/mint";

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
      <span className="text-heading-3-semibold text-text-strong">관심 코인을 담아 보세요</span>
      <PageDots current={1} total={3} />
    </div>
  );
}
