"use client";

import { Button, ToastProvider, useSnackbar, useToast } from "@futurewiz-rms/mint";

export default function WithToast() {
  return (
    // 토스트와 스낵바는 같은 Provider가 그리고, 띄운 순서대로 한 자리에 쌓여요
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}

function Buttons() {
  const toast = useToast();
  const snackbar = useSnackbar();
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <Button color="secondary" onClick={() => toast.positive("저장했어요.")}>
        토스트
      </Button>
      <Button
        color="secondary"
        onClick={() =>
          snackbar("메모를 보관했어요.", {
            addOn: (
              <Button variant="outline" color="neutral" size="md">
                보기
              </Button>
            ),
          })
        }
      >
        스낵바
      </Button>
    </div>
  );
}
