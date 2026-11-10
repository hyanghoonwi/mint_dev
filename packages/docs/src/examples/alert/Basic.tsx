"use client";

import { useState } from "react";
import { Alert, Button } from "@futurewiz-rms/mint";

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>알림 설정</Button>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        heading="알림을 켤까요?"
        action={
          <>
            <Button color="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>켜기</Button>
          </>
        }
        body="설정에서 언제든 끌 수 있어요."
      />
    </>
  );
}
