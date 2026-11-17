"use client";

import { Radio, RadioGroup, type RadioSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function RadioPlayground() {
  return (
    <Playground
      controls={[
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "sm" },
        { prop: "label", type: "boolean", default: true },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "tight", type: "boolean", default: false },
      ]}
      render={(values) => (
        <RadioGroup
          size={values.size as RadioSize}
          defaultValue="latest"
          disabled={values.disabled as boolean}
          aria-label="정렬 기준"
        >
          {[
            ["latest", "최신순"],
            ["popular", "인기순"],
            ["price", "가격순"],
          ].map(([value, label]) => (
            <Radio
              key={value}
              value={value}
              tight={values.tight as boolean}
              aria-label={values.label ? undefined : label}
            >
              {values.label ? label : undefined}
            </Radio>
          ))}
        </RadioGroup>
      )}
      code={(values) => {
        const radio = (value: string, label: string) =>
          jsx(
            "Radio",
            {
              value,
              tight: values.tight as boolean,
              "aria-label": values.label ? undefined : label,
            },
            values.label ? label : undefined,
          )
            .split("\n")
            .slice(2)
            .join("\n");
        const items = [
          radio("latest", "최신순"),
          radio("popular", "인기순"),
          radio("price", "가격순"),
        ]
          .map((line) => `  ${line.split("\n").join("\n  ")}`)
          .join("\n");
        const open = jsx(
          "RadioGroup",
          {
            size: values.size !== "sm" ? (values.size as string) : undefined,
            defaultValue: "latest",
            disabled: values.disabled as boolean,
            "aria-label": "정렬 기준",
          },
          " ",
          ["Radio"],
        )
          .replace(/>\s+<\/RadioGroup>$/, `>\n${items}\n</RadioGroup>`)
          .replace(/>\n {2}\n<\/RadioGroup>$/, `>\n${items}\n</RadioGroup>`);
        return open;
      }}
    />
  );
}

/** Radio 사용 가이드 그림 */
export function RadioGuide() {
  return (
    <DoDont
      good={
        <RadioGroup defaultValue="card" aria-label="결제 수단">
          <Radio value="card">카드</Radio>
          <Radio value="bank">계좌이체</Radio>
          <Radio value="point">포인트</Radio>
        </RadioGroup>
      }
      goodText={<>처음부터 기본값 하나를 선택해 두고, 선택지는 세로로 나열해요.</>}
      bad={
        <RadioGroup
          aria-label="가입 경로"
          style={{ flexDirection: "row", flexWrap: "wrap", width: 220 }}
        >
          {["검색", "광고", "지인", "SNS", "뉴스", "기타"].map((label) => (
            <Radio key={label} value={label} tight style={{ marginRight: 12 }}>
              {label}
            </Radio>
          ))}
        </RadioGroup>
      }
      badText={<>선택지가 5개 이상이면 Radio를 쓰지 않아요. Select를 써요.</>}
    />
  );
}
