"use client";

import { PageCounter, PageDots } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function PageIndicatorPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "type", type: "select", options: ["dots", "counter"], default: "dots" },
        {
          prop: "variant",
          type: "select",
          options: (values) =>
            values.type === "dots" ? ["normal", "white"] : ["normal", "alternative"],
          default: "normal",
        },
        { prop: "size", type: "select", options: ["md", "sm"], default: "md" },
        {
          prop: "total",
          type: "select",
          options: (values) => (values.type === "dots" ? [2, 3, 4, 5, 6, 7] : [10, 24, 100]),
          default: 5,
        },
        {
          prop: "current",
          type: "select",
          // 점은 1~total 전부, 숫자는 처음·중간·끝 몇 개만 고를 수 있게 한다
          options: (values) => {
            const total = values.total as number;
            if (values.type === "dots")
              return Array.from({ length: total }, (_, index) => index + 1);
            return [...new Set([1, 2, 3, Math.ceil(total / 2), total])];
          },
          default: 1,
        },
      ]}
      render={(values) => {
        const common = {
          current: values.current as number,
          total: values.total as number,
          size: values.size as "md" | "sm",
        };
        const node =
          values.type === "dots" ? (
            <PageDots {...common} variant={values.variant as "normal" | "white"} />
          ) : (
            <PageCounter {...common} variant={values.variant as "normal" | "alternative"} />
          );
        // white는 이미지 위에서 쓰는 색이라 진한 바탕을 깔아 보여 줘요
        return values.variant === "white" ? (
          <span className="docs-onfill-stage">{node}</span>
        ) : (
          node
        );
      }}
      code={(values) =>
        jsx(values.type === "dots" ? "PageDots" : "PageCounter", {
          current: values.current as number,
          total: values.total as number,
          variant: values.variant !== "normal" ? (values.variant as string) : undefined,
          size: values.size !== "md" ? (values.size as string) : undefined,
        })
      }
    />
  );
}

/** Page indicator 사용 가이드 그림 */
export function PageIndicatorGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <PageDots current={2} total={5} />
          <PageCounter current={7} total={24} variant="alternative" />
        </span>
      }
      goodText={<>점은 7개 이하일 때만 쓰고, 더 많으면 숫자로 바꿔요.</>}
      bad={<PageDots current={4} total={12} size="sm" />}
      badText={<>점이 8개 이상이면 위치를 알아보기 어려워요. Counter를 써요.</>}
    />
  );
}
