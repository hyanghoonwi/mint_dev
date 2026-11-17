"use client";

import { GlobeIcon, Select, type SelectSize, type SelectStatus } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";
import { fieldControls } from "./fieldControls";

const options = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH" },
  { value: "xrp", label: "XRP" },
];

const controls = fieldControls({
  label: "시장",
  placeholder: "선택해 주세요",
  content: [{ prop: "leadingIcon", type: "boolean", default: false }],
  behavior: [
    { prop: "multiple", type: "boolean", default: false },
    {
      prop: "render",
      type: "select",
      options: (values) => (values.multiple ? ["text", "chip"] : ["text"]),
      default: "text",
    },
  ],
});

const optionsCode = `[
${options
  .map(
    (option) =>
      `    { value: ${JSON.stringify(option.value)}, label: ${JSON.stringify(option.label)} },`,
  )
  .join("\n")}
  ]`;

/** 샌드박스: 오른쪽에서 props를 바꾸면 Select와 아래 코드가 함께 바뀌어요 */
export function SelectPlayground() {
  return (
    <Playground
      stageMinHeight={360}
      controls={controls}
      render={(values) => {
        const multiple = values.multiple as boolean;
        const common = {
          size: values.size as SelectSize,
          label: values.label as string,
          placeholder: values.placeholder as string,
          helper: values.helper as string,
          helpIcon: values.helpIcon as boolean,
          leadingIcon: values.leadingIcon ? <GlobeIcon /> : undefined,
          options,
          status: values.status as SelectStatus,
          disabled: values.disabled as boolean,
          readOnly: values.readOnly as boolean,
          required: values.required as boolean,
          labelPosition: values.labelPosition as "top" | "left",
        };
        return multiple ? (
          <Select
            // 선택 방식이 바뀌면 값을 비웁니다. key는 펼치지 않고 직접 줍니다.
            key="multiple"
            {...common}
            multiple
            render={values.render as "text" | "chip"}
          />
        ) : (
          <Select key="single" {...common} />
        );
      }}
      code={(values) => {
        const multiple = values.multiple as boolean;
        return jsx(
          "Select",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            label: values.label as string,
            placeholder: values.placeholder as string,
            helper: values.helper as string,
            helpIcon: values.helpIcon as boolean,
            leadingIcon: values.leadingIcon ? { expr: "<GlobeIcon />" } : undefined,
            options: { expr: optionsCode },
            status: values.status !== "normal" ? (values.status as string) : undefined,
            disabled: values.disabled as boolean,
            readOnly: values.readOnly as boolean,
            required: values.required as boolean,
            multiple,
            render: multiple && values.render !== "text" ? (values.render as string) : undefined,
            labelPosition:
              values.labelPosition !== "top" ? (values.labelPosition as string) : undefined,
          },
          undefined,
          values.leadingIcon ? ["GlobeIcon"] : [],
        );
      }}
    />
  );
}

/** Select 사용 가이드 그림 */
export function SelectGuide() {
  return (
    <DoDont
      good={
        <Select
          size="md"
          label="시장"
          helper="거래할 시장을 골라요"
          options={options}
          defaultValue="krw"
        />
      }
      goodText={<>라벨은 한 줄로 짧게 쓰고, 보조 설명은 도움말로 둬요.</>}
      bad={
        <Select
          size="md"
          label="어떤 시장에서 거래하시겠어요? 아래에서 하나를 골라 주세요"
          options={options}
          defaultValue="krw"
        />
      }
      badText={<>라벨에 긴 문장을 쓰지 않아요.</>}
    />
  );
}
