"use client";

import { Button, ToasterProvider, useToaster } from "@futurewiz-rms/mint";

export default function Basic() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToasterProvider>
      <Buttons />
    </ToasterProvider>
  );
}

function Buttons() {
  const toaster = useToaster();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <Button color="secondary" onClick={() => toaster("알림을 켰어요.")}>
        알림
      </Button>
      <Button color="secondary" onClick={() => toaster.positive("저장했어요.")}>
        완료
      </Button>
      <Button color="secondary" onClick={() => toaster.cautionary("네트워크가 느려요.")}>
        주의
      </Button>
      <Button color="secondary" onClick={() => toaster.negative("저장하지 못했어요.")}>
        오류
      </Button>
    </div>
  );
}
