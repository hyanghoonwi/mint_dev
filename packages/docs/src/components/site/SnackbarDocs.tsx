"use client";

import { Snackbar, type SnackbarVariant } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  {
    prop: "variant",
    type: "select",
    options: ["normal", "positive", "cautionary", "negative"],
    default: "normal",
  },
  { prop: "icon", type: "boolean", default: false },
  { prop: "action", type: "boolean", default: true },
  { prop: "onClose", type: "boolean", default: false },
  { prop: "heading", type: "text", default: "관심 코인에서 뺐어요." },
  { prop: "description", type: "text", default: "" },
];

/** 샌드박스: 왼쪽에 스낵바, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function SnackbarPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <Snackbar
          variant={values.variant as SnackbarVariant}
          icon={values.icon as boolean}
          heading={values.heading as string}
          description={(values.description as string) || undefined}
          action={values.action ? { label: "되돌리기", onClick: () => {} } : undefined}
          onClose={values.onClose ? () => {} : undefined}
        />
      )}
      code={(values) =>
        jsx("Snackbar", {
          variant: values.variant !== "normal" ? (values.variant as string) : undefined,
          icon: values.icon as boolean,
          heading: values.heading as string,
          description: (values.description as string) || undefined,
          action: values.action ? { expr: '{ label: "되돌리기", onClick: restore }' } : undefined,
          onClose: values.onClose ? { expr: "() => setOpen(false)" } : undefined,
        })
      }
    />
  );
}

/** Snackbar 사용 가이드 그림 */
export function SnackbarGuide() {
  return (
    <DoDont
      good={
        <Snackbar
          heading="삭제했어요."
          action={{ label: "되돌리기", onClick: () => {} }}
          style={{ minWidth: 0, width: 260 }}
        />
      }
      goodText={<>&quot;되돌리기&quot;처럼 방금 한 행동을 취소하는 버튼을 둬요.</>}
      bad={
        <Snackbar
          heading="계정을 삭제할까요?"
          description="삭제하면 되돌릴 수 없어요."
          action={{ label: "삭제", onClick: () => {} }}
          style={{ minWidth: 0, width: 260 }}
        />
      }
      badText={<>되돌릴 수 없는 일의 확인을 Snackbar로 받지 않아요. Alert를 써요.</>}
    />
  );
}
