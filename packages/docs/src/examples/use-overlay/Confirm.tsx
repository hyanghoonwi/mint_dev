"use client";

import { Alert, Button, useOverlay } from "@futurewiz-rms/mint";

export default function Confirm() {
  const overlay = useOverlay();

  const openAlert = () =>
    overlay.open(({ isOpen, close }) => (
      <Alert
        open={isOpen}
        onClose={close}
        heading="알림을 켤까요?"
        body="설정에서 언제든 끌 수 있어요."
        action={
          <>
            <Button color="secondary" onClick={() => close()}>
              취소
            </Button>
            <Button onClick={() => close()}>켜기</Button>
          </>
        }
      />
    ));

  return <Button onClick={openAlert}>알림 설정</Button>;
}
