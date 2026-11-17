"use client";

import { Button, Menu, MenuDivider, MenuItem } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

type Variant = "normal" | "radio" | "checkbox";

const controls: Control[] = [
  { prop: "variant", type: "select", options: ["normal", "radio", "checkbox"], default: "normal" },
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "leadingImage", type: "boolean", default: false },
  { prop: "actionArea", type: "boolean", default: false },
  { prop: "cellPadding", type: "select", options: [8, 12], default: 8 },
  { prop: "maxHeight", type: "select", options: ["none", 176, 240, 320], default: "none" },
];

const coins = [
  { value: "btc", label: "BTC" },
  { value: "eth", label: "ETH" },
  { value: "xrp", label: "XRP" },
  { value: "sol", label: "SOL" },
  { value: "doge", label: "DOGE" },
  { value: "ada", label: "ADA" },
];

const actionAreaCode = `<>
    <Button variant="ghost" color="neutral" size="sm">초기화</Button>
    <Button size="sm">적용</Button>
  </>`;

/** 샌드박스: 오른쪽에서 props를 바꾸면 메뉴와 아래 코드가 함께 바뀌어요 */
export function MenuPlayground() {
  return (
    <Playground
      stageMinHeight={420}
      controls={controls}
      render={(values) => {
        const variant = values.variant as Variant;
        return (
          <Menu
            // 종류를 바꿀 때마다 새로 그려서 defaultValue가 반영되게 한다
            key={variant}
            variant={variant}
            size={values.size as "sm" | "md" | "lg"}
            actionArea={
              values.actionArea ? (
                <>
                  <Button variant="ghost" color="neutral" size="sm">
                    초기화
                  </Button>
                  <Button size="sm">적용</Button>
                </>
              ) : undefined
            }
            defaultValue={(variant === "checkbox" ? ["btc"] : "btc") as never}
            cellPadding={values.cellPadding as 8 | 12}
            maxHeight={values.maxHeight === "none" ? undefined : (values.maxHeight as number)}
            aria-label="코인"
          >
            {coins.map((coin) => (
              <MenuItem
                key={coin.value}
                leadingImage={values.leadingImage ? "/img/avatar-sample.jpg" : undefined}
                value={coin.value}
              >
                {coin.label}
              </MenuItem>
            ))}
          </Menu>
        );
      }}
      code={(values) => {
        const variant = values.variant as Variant;
        const items = coins
          .map(
            (coin) =>
              `<MenuItem value="${coin.value}"${values.leadingImage ? ' leadingImage="/img/avatar-sample.jpg"' : ""}>${coin.label}</MenuItem>`,
          )
          .join("\n  ");
        return jsx(
          "Menu",
          {
            variant: variant !== "normal" ? variant : undefined,
            size: values.size !== "md" ? (values.size as string) : undefined,
            actionArea: values.actionArea ? { expr: actionAreaCode } : undefined,
            defaultValue: { expr: variant === "checkbox" ? '["btc"]' : '"btc"' },
            cellPadding:
              values.cellPadding !== 8 ? { expr: String(values.cellPadding) } : undefined,
            maxHeight: values.maxHeight === "none" ? undefined : (values.maxHeight as number),
            "aria-label": "코인",
          },
          items,
          ["MenuItem", ...(values.actionArea ? ["Button"] : [])],
        );
      }}
    />
  );
}

/** Menu 사용 가이드 그림 */
export function MenuGuide() {
  return (
    <DoDont
      good={
        <Menu size="sm" aria-label="코인 작업">
          <MenuItem>복사</MenuItem>
          <MenuItem>공유</MenuItem>
          <MenuDivider />
          <MenuItem>삭제</MenuItem>
        </Menu>
      }
      goodText={<>자주 쓰는 항목은 위에, 삭제처럼 위험한 동작은 아래에 선으로 나눠 둬요.</>}
      bad={
        <Menu size="lg" aria-label="코인 작업">
          <MenuItem>이 코인을 복사하려면 여기를 누르세요</MenuItem>
          <MenuItem>삭제</MenuItem>
          <MenuItem>공유</MenuItem>
        </Menu>
      }
      badText={<>항목 이름을 긴 문장으로 쓰거나 위험한 동작을 위쪽에 두지 않아요.</>}
    />
  );
}
