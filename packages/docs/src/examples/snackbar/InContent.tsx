"use client";

import { useState } from "react";
import { Button, Snackbar, Text } from "@futurewiz-rms/mint";

export default function InContent() {
  // 본문 안에 그대로 두고, 닫기를 누르면 상태를 바꿔 숨겨요
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}
    >
      <Text as="h3" variant="heading-3-semibold" color="strong">
        내 지갑
      </Text>
      {open && (
        <Snackbar
          variant="cautionary"
          icon
          heading="본인 인증이 필요해요."
          description="인증하면 출금 한도가 늘어나요."
          addOn={
            <Button variant="outline" color="neutral" size="md">
              인증
            </Button>
          }
          onClose={() => setOpen(false)}
        />
      )}
      <Text as="p" variant="body-3-regular" color="tertiary">
        보유 자산 12,450,000원
      </Text>
    </div>
  );
}
