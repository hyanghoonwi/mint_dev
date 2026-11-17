"use client";

import { LiveStatus, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "label", type: "text", default: "" },
  { prop: "active", type: "boolean", default: true },
];

/** 샌드박스: 오른쪽에서 props를 바꾸면 Live Status와 아래 코드가 함께 바뀌어요. 문구를 비우면 기본 문구가 나와요 */
export function LiveStatusPlayground() {
  return (
    <Playground
      stageMinHeight={160}
      controls={controls}
      render={(values) => (
        <LiveStatus
          label={(values.label as string) || undefined}
          active={values.active as boolean}
        />
      )}
      code={(values) =>
        jsx("LiveStatus", {
          label: (values.label as string) || undefined,
          active: values.active ? undefined : { expr: "false" },
        })
      }
    />
  );
}

/** Live Status 사용 가이드 그림 */
export function LiveStatusGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text variant="title-3-bold" as="span">
            실시간 시세
          </Text>
          <LiveStatus />
        </span>
      }
      goodText={<>실시간으로 갱신되는 값 옆에 두고, 멈추면 Off로 바꿔요.</>}
      bad={
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text variant="title-3-bold" as="span">
            어제 종가
          </Text>
          <LiveStatus label="" />
        </span>
      }
      badText={
        <>실시간이 아닌 값 옆에 On을 쓰지 않아요. 색만으로 구분하지 말고 글자도 함께 바꿔요.</>
      }
    />
  );
}
