const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const groups = [
  { name: "base", tokens: ["white", "black"] },
  { name: "gray", tokens: [...steps, 950].map((step) => `gray-${step}`) },
  { name: "grayAlpha", tokens: steps.map((step) => `grayAlpha-${step}`) },
  ...["blue", "red", "orange", "yellow", "green", "lime", "teal", "violet", "purple", "pink"].map(
    (hue) => ({ name: hue, tokens: steps.map((step) => `${hue}-${step}`) }),
  ),
];

export default function Atomic() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {groups.map((group) => (
        <section key={group.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 className="text-heading-2-bold" style={{ margin: 0 }}>
            {group.name}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
              gap: 8,
            }}
          >
            {group.tokens.map((token) => (
              <div key={token} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  className="rounded-8 border border-border-default"
                  style={{ height: 40, background: `var(--color-atomic-${token})` }}
                />
                <code className="text-caption-1-regular">{token}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
