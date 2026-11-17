"use client";

import { useState } from "react";
import { Alert, Button } from "@futurewiz-rms/mint";

export default function SingleAction() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>점검 안내</Button>
      <Alert
        heading="점검 중이에요"
        body="잠시 후 다시 시도해 주세요."
        action={<Button onClick={() => setOpen(false)}>확인</Button>}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
