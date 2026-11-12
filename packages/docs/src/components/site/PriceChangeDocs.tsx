"use client";

import { PriceChange } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

type Direction = "up" | "down" | "flat";

const controls: Control[] = [
  { prop: "direction", type: "select", options: ["up", "down", "flat"], default: "up" },
  { prop: "type", type: "select", options: ["amount", "percent"], default: "amount" },
  { prop: "variant", type: "select", options: ["text", "weak"], default: "text" },
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "children", type: "text", default: "1,200" },
];

/** 샌드박스: 왼쪽에 등락 표시, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function PriceChangePlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <PriceChange
          direction={v.direction as Direction}
          type={v.type as "amount" | "percent"}
          variant={v.variant as "text" | "weak"}
          size={v.size as "sm" | "md" | "lg"}
        >
          {v.children as string}
        </PriceChange>
      )}
      code={(v) =>
        jsx(
          "PriceChange",
          {
            direction: v.direction as string,
            type: v.type !== "amount" ? (v.type as string) : undefined,
            variant: v.variant !== "text" ? (v.variant as string) : undefined,
            size: v.size !== "md" ? (v.size as string) : undefined,
          },
          v.children as string,
        )
      }
    />
  );
}

/** PriceChange 사용 가이드 그림 */
export function PriceChangeGuide() {
  return (
    <DoDont
      good={
        <>
          <PriceChange direction="up" variant="weak">
            100,000
          </PriceChange>
          <PriceChange direction="up" variant="weak" type="percent">
            3.42%
          </PriceChange>
          <PriceChange direction="down" variant="weak">
            100
          </PriceChange>
          <PriceChange direction="down" variant="weak" type="percent">
            1.20%
          </PriceChange>
        </>
      }
      goodText={<>금액은 화살표(▲ ▼)로, 퍼센트는 부호(+, -)로 따로 써요.</>}
      bad={
        <>
          <PriceChange direction="up" size="sm">
            1,200
          </PriceChange>
          <PriceChange direction="up" size="lg" type="percent">
            3.42%
          </PriceChange>
        </>
      }
      badText={<>한 줄에 크기를 섞어 쓰지 않아요. 같은 목록에서는 크기를 하나로 맞춰요.</>}
    />
  );
}
