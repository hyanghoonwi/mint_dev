"use client";

import { Button, ToasterProvider, useToaster } from "@futurewiz-rms/mint";

export default function Undo() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToasterProvider>
      <DeleteButton />
    </ToasterProvider>
  );
}

function DeleteButton() {
  const toaster = useToaster();
  return (
    // 버튼이 있는 토스트는 기본 5초 동안 떠 있고, 버튼을 누르면 onAction이 불린 뒤 저절로 닫혀요
    <Button
      color="secondary"
      onClick={() =>
        toaster.normal("삭제했어요.", {
          action: "ghost",
          actionLabel: "되돌리기",
          onAction: () => toaster.positive("되돌렸어요."),
        })
      }
    >
      삭제
    </Button>
  );
}
