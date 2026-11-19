"use client";

import { Button, ToasterProvider, useToaster } from "@futurewiz-rms/mint";

export default function Position() {
  return (
    // 화면 위 가운데에, 위쪽 헤더(64px)를 가리지 않게 80px 띄워요
    <ToasterProvider shape="pill" position="top" offset={80}>
      <CopyButton />
    </ToasterProvider>
  );
}

function CopyButton() {
  const toaster = useToaster();
  return (
    <Button color="secondary" onClick={() => toaster.positive("주소를 복사했어요.")}>
      주소 복사
    </Button>
  );
}
