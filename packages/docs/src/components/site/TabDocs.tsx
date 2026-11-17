"use client";

import { Tab, type TabLayout, type TabSize, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Values } from "./Playground";

const counts = [2, 3, 4, 5, 6] as const;
const labels = ["홈", "시세", "내 자산", "거래소", "입출금", "고객센터"];

function itemsFor(values: Values) {
  return labels.slice(0, values.count as number).map((label, index) => ({
    value: `v${index + 1}`,
    label,
    badge: values.badge && index === 1 ? true : undefined,
  }));
}

export function TabPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
        { prop: "badge", type: "boolean", default: false },
        { prop: "count", type: "select", options: counts, default: 3 },
        { prop: "layout", type: "select", options: ["fill", "hug"], default: "fill" },
      ]}
      render={(values) => (
        <span style={{ display: "block", width: 360, maxWidth: "100%" }}>
          <Tab
            size={values.size as TabSize}
            items={itemsFor(values)}
            layout={values.layout as TabLayout}
            aria-label="내 정보"
          />
        </span>
      )}
      code={(values) => {
        const items = itemsFor(values)
          .map(
            (item) =>
              `    { value: "${item.value}", label: "${item.label}"${item.badge ? ", badge: true" : ""} },`,
          )
          .join("\n");
        return jsx("Tab", {
          size: values.size !== "md" ? (values.size as string) : undefined,
          items: { expr: `[\n${items}\n  ]` },
          layout: values.layout !== "fill" ? (values.layout as string) : undefined,
          "aria-label": "내 정보",
        });
      }}
    />
  );
}

/** Tab 사용 가이드 그림 */
export function TabGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "block", width: 280 }}>
          <Tab
            items={[
              { value: "home", label: "홈" },
              { value: "market", label: "시세" },
              { value: "assets", label: "내 자산" },
            ]}
            aria-label="좋은 예"
          />
        </span>
      }
      goodText={<>이름은 2~6자 명사로 짧게 쓰고, 현재 탭은 밑줄과 굵은 글자로 표시해요.</>}
      bad={
        <span aria-hidden="true" style={{ display: "block", width: 280 }}>
          <Text variant="body-3-regular" color="secondary" as="p">
            탭 안에 또 탭을 넣거나, 탭으로 다른 페이지로 이동하지 않아요.
          </Text>
        </span>
      }
      badText={<>페이지 이동은 링크나 버튼을 써요.</>}
    />
  );
}
