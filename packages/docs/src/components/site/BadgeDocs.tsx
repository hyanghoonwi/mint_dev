"use client";

import { Badge, type BadgeColor } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "variant", type: "select", options: ["fill", "weak"], default: "fill" },
  {
    prop: "color",
    type: "select",
    options: ["brand", "neutral", "danger", "success", "warning", "teal", "violet", "pink"],
    default: "brand",
  },
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "children", type: "text", default: "NEW" },
];

/** 샌드박스: 왼쪽에 뱃지, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function BadgePlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Badge
          variant={v.variant as "fill" | "weak"}
          color={v.color as BadgeColor}
          size={v.size as "sm" | "md" | "lg"}
        >
          {v.children as string}
        </Badge>
      )}
      code={(v) =>
        jsx(
          "Badge",
          {
            variant: v.variant !== "fill" ? (v.variant as string) : undefined,
            color: v.color !== "brand" ? (v.color as string) : undefined,
            size: v.size !== "md" ? (v.size as string) : undefined,
          },
          v.children as string,
        )
      }
    />
  );
}

/** Badge 사용 가이드 그림 */
export function BadgeGuide() {
  return (
    <DoDont
      good={
        <>
          <Badge variant="weak" color="success">
            완료
          </Badge>
          <Badge variant="weak" color="danger">
            마감임박
          </Badge>
        </>
      }
      goodText={<>성공은 success, 오류나 마감 임박은 danger처럼 의미대로 색을 골라요.</>}
      bad={<Badge color="neutral">지금 바로 신청하세요</Badge>}
      badText={<>긴 문장을 넣지 않아요. 1~4자로 줄여 써요.</>}
    />
  );
}
