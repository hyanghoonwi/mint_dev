"use client";

import { Button, ToastProvider, useSnackbar } from "@futurewiz-rms/mint";

export default function Variants() {
  return (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}

function Buttons() {
  const snackbar = useSnackbar();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <Button color="secondary" onClick={() => snackbar.positive("주문했어요.", { icon: true })}>
        완료
      </Button>
      <Button
        color="secondary"
        onClick={() =>
          snackbar.cautionary("본인 인증이 필요해요.", {
            description: "인증하면 출금할 수 있어요.",
            icon: true,
            closable: true,
          })
        }
      >
        주의
      </Button>
      <Button
        color="secondary"
        onClick={() =>
          snackbar.negative("주문하지 못했어요.", {
            icon: true,
            action: { label: "다시 시도", onClick: () => {} },
          })
        }
      >
        오류
      </Button>
    </div>
  );
}
