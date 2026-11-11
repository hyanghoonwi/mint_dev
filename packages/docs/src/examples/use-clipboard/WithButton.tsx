"use client";

import { Button, CheckIcon, CopyIcon, useClipboard } from "@futurewiz-rms/mint";

export default function WithButton() {
  const { copy, copied } = useClipboard({ timeout: 1500 });

  return (
    <Button
      variant="outline"
      leftAddon={copied ? <CheckIcon /> : <CopyIcon />}
      onClick={() => copy("TX-20261111-0042")}
    >
      {copied ? "복사했어요" : "거래 ID 복사"}
    </Button>
  );
}
