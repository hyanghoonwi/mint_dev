"use client";

import { useState } from "react";
import { Alert, Button } from "@futurewiz-rms/mint";

export default function SingleAction() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>점검 안내</Button>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        heading="점검 중이에요"
        action={<Button onClick={() => setOpen(false)}>확인</Button>}
        body="잠시 후 다시 시도해 주세요."
      />
    </>
  );
}
