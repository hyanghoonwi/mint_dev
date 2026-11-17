"use client";

import { Button, IconButton, ShareNetworkIcon, Tooltip } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

type Position = "top" | "bottom" | "left" | "right";

const controls: Control[] = [
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "label", type: "text", default: "공유" },
  { prop: "position", type: "select", options: ["top", "bottom", "left", "right"], default: "top" },
  { prop: "arrowAlign", type: "select", options: ["start", "center", "end"], default: "center" },
];

/** 샌드박스: 말풍선을 열어 둔 채로 보여 주고, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function TooltipPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <Tooltip
          size={values.size as "sm" | "md" | "lg"}
          label={values.label as string}
          open
          position={values.position as Position}
          arrowAlign={values.arrowAlign as "start" | "center" | "end"}
        >
          <IconButton variant="background" icon={<ShareNetworkIcon />} aria-label="공유" />
        </Tooltip>
      )}
      code={(values) =>
        jsx(
          "Tooltip",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            label: values.label as string,
            position: values.position !== "top" ? (values.position as string) : undefined,
            arrowAlign: values.arrowAlign !== "center" ? (values.arrowAlign as string) : undefined,
          },
          '<IconButton icon={<ShareNetworkIcon />} aria-label="공유" />',
          ["IconButton", "ShareNetworkIcon"],
        )
      }
    />
  );
}

/** Tooltip 사용 가이드 그림 */
export function TooltipGuide() {
  return (
    <DoDont
      good={
        <span style={{ paddingTop: 40 }}>
          <Tooltip label="공유" open>
            <IconButton variant="background" icon={<ShareNetworkIcon />} aria-label="공유" />
          </Tooltip>
        </span>
      }
      goodText={<>아이콘만 있는 버튼에 이름을 알려 줘요.</>}
      bad={
        <span style={{ paddingTop: 40 }}>
          <Tooltip label="자세히 보려면 여기를 누르세요" open>
            <Button color="secondary" size="sm">
              수수료
            </Button>
          </Tooltip>
        </span>
      }
      badText={<>반드시 읽어야 하는 안내나 누를 곳을 Tooltip에만 두지 않아요.</>}
    />
  );
}
