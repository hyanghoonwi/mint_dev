"use client";

import { useState } from "react";
import { Pagination, type PaginationVariant } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

/** 미리보기 안에서 직접 눌러 볼 수 있게 상태를 가진다 */
function Demo({
  total,
  variant,
  start,
}: {
  total: number;
  variant: PaginationVariant;
  start: number;
}) {
  const [page, setPage] = useState(start);
  return (
    <Pagination page={Math.min(page, total)} total={total} variant={variant} onChange={setPage} />
  );
}

export function PaginationPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        {
          prop: "variant",
          type: "select",
          options: ["extended", "compact", "responsive"],
          default: "extended",
        },
        { prop: "total", type: "select", options: [5, 7, 20, 99], default: 99 },
        {
          prop: "page",
          type: "select",
          options: (v) =>
            [...new Set([1, 4, 6, (v.total as number) - 2, v.total as number])].filter(
              (n) => n >= 1 && n <= (v.total as number),
            ),
          default: 6,
        },
      ]}
      render={(v) => (
        <Demo
          key={`${String(v.variant)}-${String(v.total)}-${String(v.page)}`}
          total={v.total as number}
          variant={v.variant as PaginationVariant}
          start={v.page as number}
        />
      )}
      code={(v) =>
        jsx("Pagination", {
          page: { expr: "page" },
          total: v.total as number,
          variant: v.variant !== "responsive" ? (v.variant as string) : undefined,
          onChange: { expr: "setPage" },
        })
      }
    />
  );
}

/** Pagination 사용 가이드 그림 */
export function PaginationGuide() {
  return (
    <DoDont
      good={<Pagination page={6} total={99} variant="compact" />}
      goodText={<>모바일에서는 Compact로 번호를 줄여 누르기 쉽게 해요.</>}
      bad={
        <span style={{ display: "inline-block", maxWidth: 260, overflow: "hidden" }}>
          <Pagination page={6} total={99} variant="extended" />
        </span>
      }
      badText={<>모바일에서 Extended를 쓰지 않아요. 번호가 넘치거나 작아져 누르기 어려워요.</>}
    />
  );
}
