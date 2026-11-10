"use client";

import { useState } from "react";
import { Alert, Button } from "@futurewiz-rms/mint";

export default function BodyOnly() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>나가기</Button>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        action={
          <>
            <Button color="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>나가기</Button>
          </>
        }
        body="저장하지 않은 내용이 있어요."
      />
    </>
  );
}
