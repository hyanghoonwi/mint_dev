"use client";

import { ProgressBar, type ProgressBarStatus, type ProgressBarType } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  {
    prop: "value",
    type: "select",
    // 타입에 따라 고를 수 있는 값이 다르다(diverging은 음수도 받는다)
    options: (values) =>
      values.type === "diverging" ? [-100, -50, -25, 0, 25, 50, 100] : [0, 25, 50, 75, 100],
    default: 50,
  },
  {
    prop: "status",
    type: "select",
    options: ["normal", "negative", "positive"],
    default: "normal",
  },
  { prop: "type", type: "select", options: ["default", "diverging"], default: "default" },
];

/** 샌드박스: 왼쪽에 막대, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function ProgressBarPlayground() {
  return (
    <Playground
      stageMinHeight={160}
      controls={controls}
      render={(values) => (
        <div style={{ width: "100%", maxWidth: 360 }}>
          <ProgressBar
            value={values.value as number}
            status={values.status as ProgressBarStatus}
            type={values.type as ProgressBarType}
            aria-label="진행 정도"
          />
        </div>
      )}
      code={(values) =>
        jsx("ProgressBar", {
          value: values.value as number,
          status:
            values.type === "default" && values.status !== "normal"
              ? (values.status as string)
              : undefined,
          type: values.type !== "default" ? (values.type as string) : undefined,
          "aria-label": "진행 정도",
        })
      }
    />
  );
}

/** ProgressBar 사용 가이드 그림 */
export function ProgressBarGuide() {
  return (
    <DoDont
      good={<ProgressBar value={65} aria-label="업로드 진행" />}
      goodText={<>끝이 있는 작업에 써요. 이름은 aria-label로 꼭 알려 줘요.</>}
      bad={<ProgressBar value={65} status="positive" aria-label="로딩 중" />}
      badText={<>끝을 알 수 없는 로딩에 쓰지 않아요. 그때는 Circular를 써요.</>}
    />
  );
}
