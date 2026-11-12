"use client";

import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

export default function Basic() {
  return (
    // 실제 앱에서는 app/layout.tsx에 한 번만 둬요
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}

function Buttons() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <Button color="secondary" onClick={() => toast("알림을 켰어요.")}>
        알림
      </Button>
      <Button color="secondary" onClick={() => toast.positive("저장했어요.")}>
        완료
      </Button>
      <Button color="secondary" onClick={() => toast.cautionary("네트워크가 느려요.")}>
        주의
      </Button>
      <Button color="secondary" onClick={() => toast.negative("저장하지 못했어요.")}>
        오류
      </Button>
    </div>
  );
}
