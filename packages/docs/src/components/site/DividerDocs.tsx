"use client";

import { Divider, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  {
    prop: "orientation",
    type: "select",
    options: ["horizontal", "vertical"],
    default: "horizontal",
  },
  {
    prop: "variant",
    type: "select",
    // thick은 가로선만
    options: (v) =>
      v.orientation === "vertical" ? ["default", "strong"] : ["default", "strong", "thick"],
    default: "default",
  },
  { prop: "inset", type: "boolean", default: false },
];

/** 샌드박스: 왼쪽에 구분선, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function DividerPlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) =>
        v.orientation === "vertical" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 20 }}>
            <Text variant="body-4-regular" color="secondary">
              최신순
            </Text>
            <Divider orientation="vertical" variant={v.variant as "default" | "strong"} />
            <Text variant="body-4-regular" color="secondary">
              인기순
            </Text>
          </div>
        ) : (
          <div style={{ width: 280, background: "var(--mint-background-default)" }}>
            <Text as="p" variant="body-3-regular" className="p-4">
              알림 설정
            </Text>
            <Divider
              variant={v.variant as "default" | "strong" | "thick"}
              inset={v.inset as boolean}
            />
            <Text as="p" variant="body-3-regular" className="p-4">
              개인정보 보호
            </Text>
          </div>
        )
      }
      code={(v) =>
        jsx("Divider", {
          orientation: v.orientation !== "horizontal" ? (v.orientation as string) : undefined,
          variant: v.variant !== "default" ? (v.variant as string) : undefined,
          inset: v.orientation === "horizontal" && v.inset ? true : undefined,
        })
      }
    />
  );
}

/** Divider 사용 가이드 그림 */
export function DividerGuide() {
  const rows = ["알림 설정", "개인정보 보호", "고객센터"];
  return (
    <DoDont
      good={
        <div style={{ width: 220, background: "var(--mint-background-default)" }}>
          {rows.map((row, i) => (
            <div key={row}>
              {i > 0 && <Divider />}
              <Text as="p" variant="body-4-regular" className="px-4 py-3">
                {row}
              </Text>
            </div>
          ))}
        </div>
      }
      goodText={<>목록 항목 사이에는 default를 써요. 화면 영역을 크게 나눌 때만 thick을 써요.</>}
      bad={
        <div style={{ width: 220, background: "var(--mint-background-default)" }}>
          {rows.map((row, i) => (
            <div key={row}>
              {i > 0 && <Divider variant="thick" />}
              <Text as="p" variant="body-4-regular" className="px-4 py-3">
                {row}
              </Text>
            </div>
          ))}
        </div>
      }
      badText={<>목록 항목마다 thick 띠를 넣지 않아요. 화면이 답답해 보여요.</>}
    />
  );
}
