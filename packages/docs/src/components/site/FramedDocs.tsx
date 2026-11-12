"use client";

import {
  Framed,
  FramedCheckbox,
  FramedRadio,
  type FramedSize,
  RadioGroup,
  Text,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Values } from "./Playground";

const look = (v: Values) => ({
  size: v.size as FramedSize,
  error: v.error as boolean,
  shadow: v.shadow as boolean,
  disabled: v.disabled as boolean,
});

export function FramedPlayground() {
  return (
    <Playground
      stageMinHeight={240}
      controls={[
        {
          prop: "type",
          type: "select",
          options: ["checkbox", "radio", "placeholder"],
          default: "checkbox",
        },
        { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
        { prop: "error", type: "boolean", default: false },
        { prop: "selected", type: "boolean", default: true },
        { prop: "shadow", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "description", type: "boolean", default: true },
      ]}
      render={(v) => {
        const description = v.description ? "설명" : undefined;
        const box =
          v.type === "checkbox" ? (
            <FramedCheckbox
              key={`c-${String(v.selected)}`}
              label="텍스트"
              description={description}
              defaultChecked={v.selected as boolean}
              {...look(v)}
            />
          ) : v.type === "radio" ? (
            <RadioGroup
              key={`r-${String(v.selected)}`}
              aria-label="미리보기"
              defaultValue={v.selected ? "a" : undefined}
            >
              <FramedRadio value="a" label="텍스트" description={description} {...look(v)} />
            </RadioGroup>
          ) : (
            <Framed selected={v.selected as boolean} {...look(v)}>
              <span className="docs-framed-placeholder" />
            </Framed>
          );
        return <div style={{ width: 360, maxWidth: "100%" }}>{box}</div>;
      }}
      code={(v) => {
        const common = {
          size: v.size !== "md" ? (v.size as string) : undefined,
          error: v.error as boolean,
          shadow: v.shadow as boolean,
          disabled: v.disabled as boolean,
        };
        if (v.type === "checkbox")
          return jsx("FramedCheckbox", {
            label: "텍스트",
            description: v.description ? "설명" : undefined,
            defaultChecked: v.selected as boolean,
            ...common,
          });
        if (v.type === "radio")
          return jsx(
            "RadioGroup",
            { "aria-label": "요금제", defaultValue: v.selected ? "a" : undefined },
            `\n  <FramedRadio value="a" label="텍스트"${v.description ? ' description="설명"' : ""}${common.size ? ` size="${common.size}"` : ""}${common.error ? " error" : ""}${common.shadow ? " shadow" : ""}${common.disabled ? " disabled" : ""} />\n`,
            ["FramedRadio"],
          ).replace(/>\n {2}\n {2}<FramedRadio/, ">\n  <FramedRadio");
        return jsx("Framed", { selected: v.selected as boolean, ...common }, "{/* 내용 */}");
      }}
    />
  );
}

/** Framed 사용 가이드 그림 */
export function FramedGuide() {
  return (
    <DoDont
      good={
        <RadioGroup aria-label="요금제" defaultValue="pro" className="gap-2" style={{ width: 240 }}>
          <FramedRadio value="basic" label="베이직" description="시세 알림 10개" size="sm" />
          <FramedRadio value="pro" label="프로" description="시세 알림 무제한" size="sm" />
        </RadioGroup>
      }
      goodText={<>설명이 긴 선택지를 같은 크기의 틀로 나란히 보여 줘요.</>}
      bad={
        <Framed size="sm" style={{ width: 240 }}>
          <Framed size="sm">
            <Text variant="body-3-regular" color="secondary">
              공지사항
            </Text>
          </Framed>
        </Framed>
      }
      badText={<>틀 안에 틀을 중첩하거나 장식용 박스로 쓰지 않아요.</>}
    />
  );
}
