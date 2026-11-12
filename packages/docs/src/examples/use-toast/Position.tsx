"use client";

import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

export default function Position() {
  return (
    // 화면 위 가운데에, 위쪽 헤더(64px)를 가리지 않게 80px 띄워요
    <ToastProvider position="top" offset={80} shape="pill">
      <CopyButton />
    </ToastProvider>
  );
}

function CopyButton() {
  const toast = useToast();
  return (
    <Button color="secondary" onClick={() => toast.positive("주소를 복사했어요.")}>
      주소 복사
    </Button>
  );
}
