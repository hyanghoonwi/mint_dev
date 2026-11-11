"use client";

import { CheckIcon, CopyIcon, IconButton, Text, useClipboard } from "@futurewiz-rms/mint";

const address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

export default function CopyAddress() {
  const { copy, copied } = useClipboard();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 280 }}>
      <Text variant="body-3-regular" lines={1}>
        {address}
      </Text>
      {/* 복사하면 아이콘과 이름을 함께 바꾼다(2초 뒤 돌아옴) */}
      <IconButton
        size="sm"
        icon={copied ? <CheckIcon /> : <CopyIcon />}
        aria-label={copied ? "복사했어요" : "주소 복사"}
        onClick={() => copy(address)}
      />
    </div>
  );
}
