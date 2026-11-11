"use client";

import { ListIcon, SegmentedControl, type SegmentedControlSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Values } from "./Playground";

const counts = [2, 3, 4, 5, 6] as const;
const labels = ["일", "주", "월", "분기", "연", "전체"];

function itemsFor(v: Values) {
  return labels.slice(0, v.count as number).map((label, index) => ({
    value: `v${index + 1}`,
    label,
    icon: v.icon ? <ListIcon /> : undefined,
  }));
}

export function SegmentedControlPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
        { prop: "count", type: "select", options: counts, default: 3 },
        { prop: "icon", type: "boolean", default: false },
        { prop: "fullWidth", type: "boolean", default: false },
      ]}
      render={(v) => (
        <span style={{ display: "block", width: v.fullWidth ? 360 : undefined, maxWidth: "100%" }}>
          <SegmentedControl
            aria-label="기간"
            items={itemsFor(v)}
            size={v.size as SegmentedControlSize}
            fullWidth={v.fullWidth as boolean}
          />
        </span>
      )}
      code={(v) => {
        const items = itemsFor(v)
          .map(
            (item) =>
              `    { value: "${item.value}", label: "${item.label}"${v.icon ? ", icon: <ListIcon />" : ""} },`,
          )
          .join("\n");
        return jsx("SegmentedControl", {
          "aria-label": "기간",
          size: v.size !== "md" ? (v.size as string) : undefined,
          fullWidth: v.fullWidth ? true : undefined,
          items: { expr: `[\n${items}\n  ]` },
        });
      }}
    />
  );
}

/** SegmentedControl 사용 가이드 그림 */
export function SegmentedControlGuide() {
  return (
    <DoDont
      good={
        <SegmentedControl
          aria-label="좋은 예"
          items={[
            { value: "list", label: "목록" },
            { value: "grid", label: "격자" },
          ]}
        />
      }
      goodText={<>이름은 1~4자로 짧게 쓰고, 처음부터 하나를 선택해 둬요.</>}
      bad={
        <span
          aria-hidden="true"
          className="inline-grid grid-flow-col auto-cols-fr rounded-12 bg-fill-neutral-weak p-1"
        >
          {["홈", "시세", "내 자산"].map((label) => (
            <span
              key={label}
              className="inline-flex h-8 items-center justify-center px-3 text-label-2-medium text-text-secondary"
            >
              {label}
            </span>
          ))}
        </span>
      }
      badText={<>선택 없음 상태를 만들거나, 화면 섹션을 바꾸는 데 쓰지 않아요(Tab을 써요).</>}
    />
  );
}
