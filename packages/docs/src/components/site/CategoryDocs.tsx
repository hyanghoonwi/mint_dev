"use client";

import {
  Category,
  type CategoryShape,
  type CategorySize,
  type CategoryVariant,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Values } from "./Playground";

const counts = [3, 4, 5, 6, 7] as const;
const labels = ["메이저", "디파이", "밈", "레이어2", "AI", "게임", "스테이블"];

/** 칩 n개(전체 칩 포함). 전체를 켜면 나머지는 n-1개 */
function itemsFor(v: Values) {
  const n = (v.chip as number) - (v.all ? 1 : 0);
  return labels.slice(0, n).map((label, index) => ({
    value: `c${index + 1}`,
    label,
    badge: v.badge === true && index === 0 ? true : undefined,
  }));
}

export function CategoryPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "variant", type: "select", options: ["solid", "outline"], default: "solid" },
        { prop: "size", type: "select", options: ["lg", "md"], default: "lg" },
        { prop: "shape", type: "select", options: ["square", "pill"], default: "square" },
        { prop: "chip", type: "select", options: counts, default: 4 },
        { prop: "all", type: "boolean", default: true },
        { prop: "badge", type: "boolean", default: false },
        { prop: "fade", type: "boolean", default: true },
      ]}
      render={(v) => (
        <span className={v.variant === "outline" ? "docs-gray-stage" : "docs-white-stage"}>
          <Category
            aria-label="코인 분류"
            items={itemsFor(v)}
            variant={v.variant as CategoryVariant}
            size={v.size as CategorySize}
            shape={v.shape as CategoryShape}
            all={v.all as boolean}
            fade={v.fade as boolean}
            style={{ width: 360, maxWidth: "100%" }}
          />
        </span>
      )}
      code={(v) => {
        const items = itemsFor(v)
          .map(
            (item) =>
              `    { value: "${item.value}", label: "${item.label}"${item.badge ? ", badge: true" : ""} },`,
          )
          .join("\n");
        return jsx("Category", {
          "aria-label": "코인 분류",
          variant: v.variant !== "solid" ? (v.variant as string) : undefined,
          size: v.size !== "lg" ? (v.size as string) : undefined,
          shape: v.shape !== "square" ? (v.shape as string) : undefined,
          all: v.all ? undefined : { expr: "false" },
          fade: v.fade ? undefined : { expr: "false" },
          items: { expr: `[\n${items}\n  ]` },
        });
      }}
    />
  );
}

const sample = [
  { value: "major", label: "메이저" },
  { value: "defi", label: "디파이" },
  { value: "meme", label: "밈" },
  { value: "layer2", label: "레이어2" },
  { value: "ai", label: "AI" },
];

/** Category 사용 가이드 그림 */
export function CategoryGuide() {
  return (
    <DoDont
      good={
        <Category aria-label="좋은 예" items={sample} style={{ width: 240, maxWidth: "100%" }} />
      }
      goodText={<>한 줄로 두고, 넘치면 스크롤해요. 맨 앞에 "전체"를 둬요.</>}
      bad={
        <span style={{ display: "flex", flexWrap: "wrap", gap: 8, width: 240 }} aria-hidden="true">
          {["전체", ...sample.map((item) => item.label)].map((label, index) => (
            <span
              key={label}
              className={
                index < 2
                  ? "rounded-12 bg-fill-neutral px-4 py-2 text-label-2-medium text-text-on-fill"
                  : "rounded-12 bg-fill-neutral-medium px-4 py-2 text-label-2-medium text-text-secondary"
              }
            >
              {label}
            </span>
          ))}
        </span>
      }
      badText={<>두 줄로 줄바꿈하거나 여러 개를 함께 선택하지 않아요.</>}
    />
  );
}
