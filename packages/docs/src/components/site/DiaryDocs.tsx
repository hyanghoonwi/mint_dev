"use client";

import { Diary } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

const sampleEvents = {
  "2026-11-15": [{ label: "언락" }, { label: "메인넷" }],
  "2026-11-18": [{ label: "언락" }, { label: "메인넷" }, { label: "상장" }],
  "2026-11-20": [{ label: "언락" }],
};

export function DiaryPlayground() {
  return (
    <Playground
      stageMinHeight={220}
      controls={[
        { prop: "count", type: "select", options: [3, 7, 14], default: 7 },
        { prop: "disablePast", type: "boolean", default: false },
        { prop: "maxEvents", type: "select", options: [1, 2, 3], default: 2 },
      ]}
      render={(values) => (
        <Diary
          count={values.count as number}
          today="2026-11-18"
          holidays={{ "2026-11-17": "임시 공휴일" }}
          min={values.disablePast ? "2026-11-18" : undefined}
          events={sampleEvents}
          maxEvents={values.maxEvents as number}
          start="2026-11-15"
          style={{ maxWidth: 672 }}
        />
      )}
      code={(values) =>
        jsx("Diary", {
          count: values.count !== 7 ? (values.count as number) : undefined,
          today: "2026-11-18",
          min: values.disablePast ? "2026-11-18" : undefined,
          events: { expr: '{ "2026-11-18": [{ label: "언락" }] }' },
          maxEvents: values.maxEvents !== 2 ? (values.maxEvents as number) : undefined,
          start: "2026-11-15",
          onChange: { expr: "setDate" },
        })
      }
    />
  );
}

/** Diary 사용 가이드 그림 */
export function DiaryGuide() {
  return (
    <DoDont
      good={
        <Diary
          count={3}
          today="2026-11-18"
          events={{
            "2026-11-18": [{ label: "언락" }, { label: "메인넷" }, { label: "상장" }],
          }}
          start="2026-11-18"
          style={{ maxWidth: 288 }}
        />
      }
      goodText={<>칩은 2개까지만 보이고 나머지는 +N으로 알려요.</>}
      bad={
        <Diary
          count={3}
          today="2026-11-18"
          events={{
            "2026-11-18": [{ label: "A 프로젝트 메인넷 언락" }, { label: "B 거래소 상장 예정" }],
          }}
          start="2026-11-18"
          style={{ maxWidth: 288 }}
        />
      }
      badText={<>칸에 일정 제목을 길게 쓰지 않아요. 제목은 날짜를 눌러 연 곳에서 보여 줘요.</>}
    />
  );
}
