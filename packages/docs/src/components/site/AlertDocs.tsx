"use client";

import { useState } from "react";
import { Alert, Button, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { Playground, type Control, type Values } from "./Playground";

const controls: Control[] = [
  { prop: "heading", type: "text", default: "알림을 켤까요?" },
  { prop: "body", type: "text", default: "설정에서 언제든 끌 수 있어요." },
  { prop: "actions", type: "select", options: [1, 2], default: 2 },
  { prop: "destructive", type: "boolean", default: false },
  { prop: "primary", type: "text", default: "켜기" },
];

/** 미리보기: 버튼을 누르면 지금 고른 값으로 Alert가 열려요 */
function AlertDemo({ values }: { values: Values }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Alert 열기</Button>
      <Alert
        open={open}
        onClose={close}
        heading={(values.heading as string) || undefined}
        body={values.body as string}
        action={
          <>
            {values.actions === 2 && (
              <Button color="secondary" onClick={close}>
                취소
              </Button>
            )}
            <Button color={values.destructive ? "destructive" : "primary"} onClick={close}>
              {values.primary as string}
            </Button>
          </>
        }
      />
    </>
  );
}

/** 그대로 복사해 쓸 수 있는 코드(열림 상태를 가진 클라이언트 컴포넌트 하나) */
function code(values: Values) {
  const lines = [
    '"use client";',
    "",
    'import { useState } from "react";',
    'import { Alert, Button } from "@futurewiz-rms/mint";',
    "",
    "export function Example() {",
    "  const [open, setOpen] = useState(false);",
    "  return (",
    "    <>",
    "      <Button onClick={() => setOpen(true)}>Alert 열기</Button>",
    "      <Alert",
    "        open={open}",
    "        onClose={() => setOpen(false)}",
    ...(values.heading ? [`        heading="${values.heading}"`] : []),
    `        body="${values.body}"`,
    "        action={",
    "          <>",
    ...(values.actions === 2
      ? [
          '            <Button color="secondary" onClick={() => setOpen(false)}>',
          "              취소",
          "            </Button>",
        ]
      : []),
    `            <Button${values.destructive ? ' color="destructive"' : ""} onClick={() => setOpen(false)}>`,
    `              ${values.primary}`,
    "            </Button>",
    "          </>",
    "        }",
    "      />",
    "    </>",
    "  );",
    "}",
  ];
  return lines.join("\n");
}

/** 샌드박스: 오른쪽에서 값을 바꾸고 왼쪽 버튼을 누르면 그 값으로 Alert가 열려요 */
export function AlertPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => <AlertDemo values={values} />}
      code={code}
    />
  );
}

/** 가이드 그림용 Alert 모양(대화상자는 칸 안에 띄울 수 없어서 같은 모양만 그린다) */
function AlertMock({ body, actions }: { body: string; actions: [string, string] }) {
  return (
    <div className="docs-alert-mock">
      <Text as="p" variant="body-3-regular" color="secondary">
        {body}
      </Text>
      <div className="docs-alert-mock__actions">
        <Button size="sm" color="secondary" tabIndex={-1}>
          {actions[0]}
        </Button>
        <Button size="sm" tabIndex={-1}>
          {actions[1]}
        </Button>
      </div>
    </div>
  );
}

/** Alert 사용 가이드 그림 */
export function AlertGuide() {
  return (
    <DoDont
      good={<AlertMock body="게시글을 삭제할까요?" actions={["취소", "삭제"]} />}
      goodText={<>버튼에는 &quot;삭제&quot;, &quot;취소&quot;처럼 행동을 구체적으로 써요.</>}
      bad={<AlertMock body="게시글을 삭제할까요?" actions={["확인", "확인했어요"]} />}
      badText={<>같은 일을 하는 버튼을 두 개 두지 않아요.</>}
    />
  );
}
