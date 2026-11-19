"use client";

import { RatioBar, type RatioBarSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const items = [
  { label: "비트코인", value: 56.2 },
  { label: "이더리움", value: 11.8 },
  { label: "스테이블코인", value: 10.9 },
  { label: "기타 암호화폐", value: 21.1 },
];

const controls: Control[] = [
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "legend", type: "boolean", default: true },
  { prop: "segments", type: "select", options: [3, 4, 5], default: 4 },
  { prop: "showValues", type: "boolean", default: true },
];

const itemsOf = (segments: number) =>
  segments === 3
    ? items.slice(0, 3)
    : segments === 4
      ? items
      : [
          ...items.slice(0, 3),
          { label: "기타 암호화폐", value: 9 },
          { label: "알트코인", value: 12.1 },
        ];

/** 샌드박스: 왼쪽에 막대, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function RatioBarPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <div style={{ width: "100%", maxWidth: 360 }}>
          <RatioBar
            size={values.size as RatioBarSize}
            items={itemsOf(values.segments as number)}
            fractionDigits={1}
            legend={values.legend as boolean}
            showValues={values.showValues as boolean}
          />
        </div>
      )}
      code={(values) =>
        jsx("RatioBar", {
          size: values.size !== "md" ? (values.size as string) : undefined,
          items: { expr: "items" },
          fractionDigits: 1,
          legend: values.legend ? undefined : false,
          showValues: values.showValues ? undefined : false,
        })
      }
    />
  );
}

/** RatioBar 사용 가이드 그림 */
export function RatioBarGuide() {
  return (
    <DoDont
      good={<RatioBar size="lg" items={items} />}
      goodText={<>구간은 3~5개로 두고, 범례에 이름과 값을 함께 보여 줘요.</>}
      bad={
        <RatioBar
          size="lg"
          items={[
            { label: "A", value: 30 },
            { label: "B", value: 25 },
            { label: "C", value: 20 },
            { label: "D", value: 15 },
            { label: "E", value: 6 },
            { label: "F", value: 4 },
          ]}
          legend={false}
          showValues={false}
        />
      }
      badText={<>구간이 6개를 넘거나, 범례도 값도 없이 색만으로 구분하게 두지 않아요.</>}
    />
  );
}
