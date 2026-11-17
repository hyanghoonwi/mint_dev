"use client";

import { PriceChange } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

type Direction = "up" | "down" | "flat";

const controls: Control[] = [
  { prop: "variant", type: "select", options: ["text", "weak"], default: "text" },
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "type", type: "select", options: ["amount", "percent"], default: "amount" },
  { prop: "direction", type: "select", options: ["up", "down", "flat"], default: "up" },
  { prop: "children", type: "text", default: "1,200" },
];

/** 샌드박스: 왼쪽에 등락 표시, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function PriceChangePlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <PriceChange
          variant={values.variant as "text" | "weak"}
          size={values.size as "sm" | "md" | "lg"}
          type={values.type as "amount" | "percent"}
          direction={values.direction as Direction}
        >
          {values.children as string}
        </PriceChange>
      )}
      code={(values) =>
        jsx(
          "PriceChange",
          {
            variant: values.variant !== "text" ? (values.variant as string) : undefined,
            size: values.size !== "md" ? (values.size as string) : undefined,
            type: values.type !== "amount" ? (values.type as string) : undefined,
            direction: values.direction as string,
          },
          values.children as string,
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
          <PriceChange variant="weak" direction="up">
            100,000
          </PriceChange>
          <PriceChange variant="weak" type="percent" direction="up">
            3.42%
          </PriceChange>
          <PriceChange variant="weak" direction="down">
            100
          </PriceChange>
          <PriceChange variant="weak" type="percent" direction="down">
            1.20%
          </PriceChange>
        </>
      }
      goodText={<>금액은 화살표(▲ ▼)로, 퍼센트는 부호(+, -)로 따로 써요.</>}
      bad={
        <>
          <PriceChange size="sm" direction="up">
            1,200
          </PriceChange>
          <PriceChange size="lg" type="percent" direction="up">
            3.42%
          </PriceChange>
        </>
      }
      badText={<>한 줄에 크기를 섞어 쓰지 않아요. 같은 목록에서는 크기를 하나로 맞춰요.</>}
    />
  );
}
