// [Figma 이름, px, Tailwind 클래스 번호]. Figma 간격 스케일(4px 단위)은 Tailwind 기본 간격 스케일과 같은 값이다.
const scale = [
  ["spacing-4", 4, "1"],
  ["spacing-8", 8, "2"],
  ["spacing-12", 12, "3"],
  ["spacing-16", 16, "4"],
  ["spacing-20", 20, "5"],
  ["spacing-24", 24, "6"],
  ["spacing-32", 32, "8"],
  ["spacing-40", 40, "10"],
  ["spacing-48", 48, "12"],
  ["spacing-64", 64, "16"],
  ["spacing-80", 80, "20"],
  ["spacing-96", 96, "24"],
] as const;

export default function Spacing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {scale.map(([name, px, tw]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <code className="text-caption-1-medium" style={{ width: 104 }}>
            {name}
          </code>
          <span className="text-caption-1-regular text-text-caption" style={{ width: 48 }}>
            {px}px
          </span>
          <span className="text-caption-1-regular text-text-secondary" style={{ width: 160 }}>
            p-{tw} · gap-{tw} · m-{tw}
          </span>
          <div
            style={{
              width: px,
              height: 16,
              borderRadius: 2,
              background: "var(--mint-brand-primary)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
