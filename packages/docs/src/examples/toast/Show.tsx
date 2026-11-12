"use client";

import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

export default function Show() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}

function SaveButton() {
  const toast = useToast();
  return <Button onClick={() => toast.positive("저장했어요.")}>저장</Button>;
}
