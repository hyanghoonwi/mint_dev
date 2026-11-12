"use client";

import { Button, ToastProvider, useSnackbar } from "@futurewiz-rms/mint";

export default function Undo() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToastProvider>
      <DeleteButton />
    </ToastProvider>
  );
}

function DeleteButton() {
  const snackbar = useSnackbar();
  return (
    <Button
      color="secondary"
      onClick={() =>
        snackbar("관심 코인에서 삭제했어요.", {
          action: { label: "되돌리기", onClick: () => snackbar.positive("다시 추가했어요.") },
        })
      }
    >
      관심 코인 삭제
    </Button>
  );
}
