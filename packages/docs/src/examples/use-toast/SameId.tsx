"use client";

import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

export default function SameId() {
  return (
    <ToastProvider>
      <LikeButton />
    </ToastProvider>
  );
}

function LikeButton() {
  const toast = useToast();
  return (
    // 같은 id면 새로 쌓지 않고 떠 있는 토스트의 내용과 시간을 새로 고쳐요
    <Button
      color="secondary"
      onClick={() => toast.positive("관심 코인에 담았어요.", { id: "like" })}
    >
      관심 코인 담기
    </Button>
  );
}
