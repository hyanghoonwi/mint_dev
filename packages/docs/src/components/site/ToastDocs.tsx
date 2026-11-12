"use client";

import { Toast, type ToastShape, type ToastVariant } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { Playground, type Control } from "./Playground";

const controls: Control[] = [
  {
    prop: "variant",
    type: "select",
    options: ["normal", "positive", "cautionary", "negative"],
    default: "positive",
  },
  { prop: "shape", type: "select", options: ["default", "pill"], default: "default" },
  { prop: "children", type: "text", default: "저장했어요." },
];

/** 샌드박스: 토스트 모양을 보여 주고, 아래에는 useToast로 띄우는 코드를 보여 줘요 */
export function ToastPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <Toast
          variant={values.variant as ToastVariant}
          shape={values.shape as ToastShape}
          style={{ width: 300, maxWidth: "100%" }}
        >
          {values.children as string}
        </Toast>
      )}
      code={(values) => {
        const method = values.variant === "normal" ? "toast" : `toast.${values.variant as string}`;
        const shape = values.shape !== "default" ? `, { shape: "${values.shape as string}" }` : "";
        return `import { useToast } from "@futurewiz-rms/mint";\n\nconst toast = useToast();\n${method}("${values.children as string}"${shape});`;
      }}
    />
  );
}

/** Toast 사용 가이드 그림 */
export function ToastGuide() {
  return (
    <DoDont
      good={
        <Toast variant="positive" style={{ width: 240 }}>
          저장했어요.
        </Toast>
      }
      goodText={<>&quot;저장했어요&quot;처럼 결과만 한 문장으로 써요.</>}
      bad={
        <Toast variant="negative" style={{ width: 240 }}>
          결제 정보가 맞지 않아요. 카드사에 확인한 뒤 다시 결제해 주세요.
        </Toast>
      }
      badText={<>꼭 읽어야 하는 안내를 Toast로 알리지 않아요. Alert를 써요.</>}
    />
  );
}
