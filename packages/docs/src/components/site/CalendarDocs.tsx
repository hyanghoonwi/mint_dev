"use client";

import { Calendar, type CalendarSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

const sampleMarks = {
  "2026-11-03": [{ color: "brand" as const }],
  "2026-11-12": [{ color: "brand" as const }, { color: "danger" as const }],
  "2026-11-20": [{ color: "success" as const }],
};

export function CalendarPlayground() {
  return (
    <Playground
      stageMinHeight={420}
      controls={[
        { prop: "size", type: "select", options: ["md", "lg"], default: "md" },
        { prop: "weekStartsOn", type: "select", options: [0, 1], default: 0 },
        { prop: "marks", type: "boolean", default: true },
      ]}
      render={(v) => (
        <Calendar
          today="2026-11-11"
          size={v.size as CalendarSize}
          weekStartsOn={v.weekStartsOn as 0 | 1}
          marks={v.marks ? sampleMarks : undefined}
          style={{ width: 340, maxWidth: "100%" }}
        />
      )}
      code={(v) =>
        jsx("Calendar", {
          today: "2026-11-11",
          size: v.size !== "md" ? (v.size as string) : undefined,
          weekStartsOn: v.weekStartsOn !== 0 ? (v.weekStartsOn as number) : undefined,
          marks: v.marks ? { expr: '{ "2026-11-12": [{ color: "brand" }] }' } : undefined,
          onChange: { expr: "setDate" },
        })
      }
    />
  );
}

/** Calendar 사용 가이드 그림 */
export function CalendarGuide() {
  return (
    <DoDont
      good={
        <Calendar
          today="2026-11-11"
          marks={{ "2026-11-12": [{ color: "brand" }], "2026-11-20": [{ color: "danger" }] }}
          style={{ width: 260 }}
        />
      }
      goodText={<>점은 일정이 있다는 표시만 해요. 내용은 날짜를 누른 뒤 아래에 보여 줘요.</>}
      bad={
        <Calendar
          today="2026-11-11"
          marks={{
            "2026-11-12": [
              { color: "brand" },
              { color: "danger" },
              { color: "success" },
              { color: "neutral" },
            ],
            "2026-11-13": [{ color: "danger" }, { color: "success" }, { color: "neutral" }],
          }}
          style={{ width: 260 }}
        />
      }
      badText={<>색을 너무 많이 쓰거나 점으로 내용을 전하려 하지 않아요(점은 3개까지만 보여요).</>}
    />
  );
}
