import * as mint from "@futurewiz-rms/mint";
import { iconCatalog, type IconComponent } from "@futurewiz-rms/mint";

// 183개 아이콘을 분류별로 보여 주는 시각 확인용 예시. 코드는 숨기고 사용법은 문서 본문에 적는다.
const icons = mint as unknown as Record<string, IconComponent>;

// arrow-left → ArrowLeftIcon
const componentName = (name: string) =>
  `${name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}Icon`;

export default function Gallery() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      {iconCatalog.map((group) => (
        <section key={group.category} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 className="text-heading-3-bold" style={{ margin: 0 }}>
            {group.category}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
              gap: 8,
            }}
          >
            {group.icons.map((name) => {
              const Icon = icons[componentName(name)];
              return (
                <div
                  key={name}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                >
                  <div
                    className="rounded-8 bg-bg-elevated"
                    style={{ display: "flex", gap: 8, padding: 12 }}
                  >
                    <Icon />
                    <Icon variant="fill" />
                  </div>
                  <code className="text-caption-1-regular text-text-secondary">{name}</code>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
