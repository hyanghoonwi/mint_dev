"use client";

import { Button, Circular, type CircularColor } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "size", type: "select", options: [12, 16, 20, 28, 40], default: 28 },
  { prop: "color", type: "select", options: ["default", "brand", "on-fill"], default: "default" },
  { prop: "label", type: "text", default: "로딩 중" },
];

/** 샌드박스: on-fill은 진한 배경 위에서 쓰는 색이라 미리보기 칸 안에 진한 바탕을 깔아 보여 줘요 */
export function CircularPlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) => {
        const circular = (
          <Circular
            size={v.size as number}
            color={v.color as CircularColor}
            label={v.label as string}
          />
        );
        return v.color === "on-fill" ? (
          <span className="docs-onfill-stage">{circular}</span>
        ) : (
          circular
        );
      }}
      code={(v) =>
        jsx("Circular", {
          size: v.size !== 28 ? (v.size as number) : undefined,
          color: v.color !== "default" ? (v.color as string) : undefined,
          label: v.label !== "로딩 중" ? (v.label as string) : undefined,
        })
      }
    />
  );
}

/** Circular 사용 가이드 그림 */
export function CircularGuide() {
  return (
    <DoDont
      good={<Button loading>저장</Button>}
      goodText={
        <>
          버튼 안의 로딩은 <code>Button</code>의 <code>loading</code>으로 보여 줘요.
        </>
      }
      bad={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Circular size={16} color="brand" />
          <Button disabled>저장</Button>
        </span>
      }
      badText={<>버튼 옆에 로딩을 따로 붙이지 않아요.</>}
    />
  );
}
