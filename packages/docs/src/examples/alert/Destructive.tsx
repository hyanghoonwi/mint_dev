"use client";

import { useState } from "react";
import { Alert, Button } from "@futurewiz-rms/mint";

export default function Destructive() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button color="destructive" onClick={() => setOpen(true)}>
        탈퇴하기
      </Button>
      <Alert
        heading="탈퇴할까요?"
        body="탈퇴하면 관심 코인과 알림 설정이 모두 사라져요."
        action={
          <>
            <Button color="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button color="destructive" onClick={() => setOpen(false)}>
              탈퇴
            </Button>
          </>
        }
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
