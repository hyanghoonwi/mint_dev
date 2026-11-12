"use client";

import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

export default function Offset() {
  return (
    // 하단 고정 버튼(높이 56 + 여백 20)을 가리지 않게 아래에서 88px 띄워요
    <ToastProvider position="bottom" offset={88}>
      <OrderButton />
    </ToastProvider>
  );
}

function OrderButton() {
  const toast = useToast();
  return (
    <Button color="secondary" onClick={() => toast.positive("주문을 접수했어요.")}>
      주문하기
    </Button>
  );
}
