"use client";

import { Button, ToasterProvider, useToaster } from "@futurewiz-rms/mint";

export default function Show() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToasterProvider>
      <SaveButton />
    </ToasterProvider>
  );
}

function SaveButton() {
  const toaster = useToaster();
  return <Button onClick={() => toaster.positive("저장했어요.")}>저장</Button>;
}
