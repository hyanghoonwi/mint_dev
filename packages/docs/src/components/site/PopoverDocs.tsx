"use client";

import {
  Box,
  Button,
  Checkbox,
  FunnelIcon,
  Popover,
  Text,
  type PopoverPlacement,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "matchWidth", type: "boolean", default: false },
  {
    prop: "placement",
    type: "select",
    options: ["bottom-start", "bottom-end"],
    default: "bottom-start",
  },
];

/** 샌드박스: 버튼을 눌러 상자를 열고, 오른쪽에서 위치·폭 맞춤을 바꿔요 */
export function PopoverPlayground() {
  return (
    <Playground
      stageMinHeight={280}
      controls={controls}
      render={(values) => (
        <Popover
          trigger={(props) => (
            <Button variant="outline" color="neutral" leftAddon={<FunnelIcon />} {...props}>
              필터
            </Button>
          )}
          matchWidth={values.matchWidth as boolean}
          placement={values.placement as PopoverPlacement}
          aria-label="필터"
        >
          <Box gap={8}>
            <Text variant="label-2-semibold">시장</Text>
            <Checkbox defaultChecked>원화</Checkbox>
            <Checkbox>BTC</Checkbox>
          </Box>
        </Popover>
      )}
      code={(values) =>
        [
          'import { Button, Popover } from "@futurewiz-rms/mint";',
          "",
          "<Popover",
          values.placement !== "bottom-start" ? `  placement="${values.placement}"` : null,
          values.matchWidth ? "  matchWidth" : null,
          '  aria-label="필터"',
          "  trigger={(props) => <Button {...props}>필터</Button>}",
          ">",
          "  {/* 필터 내용 */}",
          "</Popover>",
        ]
          .filter((line) => line !== null)
          .join("\n")
      }
    />
  );
}

/** Popover 사용 가이드 그림 */
export function PopoverGuide() {
  return (
    <DoDont
      good={
        <Popover
          trigger={(props) => (
            <Button variant="outline" color="neutral" leftAddon={<FunnelIcon />} {...props}>
              필터
            </Button>
          )}
          defaultOpen={false}
          aria-label="필터"
        >
          <Checkbox>원화</Checkbox>
        </Popover>
      }
      goodText={<>트리거 바로 아래에 짧은 선택·설정을 띄워요.</>}
      bad={
        <Button variant="outline" color="neutral">
          약관 전문 보기
        </Button>
      }
      badText={<>긴 글이나 꼭 확인해야 하는 내용은 Popover가 아니라 Modal로 띄워요.</>}
    />
  );
}
