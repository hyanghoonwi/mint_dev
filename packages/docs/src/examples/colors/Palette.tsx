const swatches = [
  "bg-brand-primary",
  "bg-brand-tint",
  "bg-brand-error",
  "bg-bg-page",
  "bg-bg-surface",
  "bg-bg-elevated",
];

export default function Palette() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
        width: "100%",
      }}
    >
      {swatches.map((swatch) => (
        <div key={swatch} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            className={`rounded-8 border border-border-default ${swatch}`}
            style={{ height: 48 }}
          />
          <code className="text-caption-1-regular">{swatch}</code>
        </div>
      ))}
    </div>
  );
}
