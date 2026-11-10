"use client";

import { Alert, Button, useOverlay } from "@futurewiz-rms/mint";

export default function SameId() {
  const overlay = useOverlay();

  const openNotice = () =>
    overlay.open(
      ({ isOpen, close }) => (
        <Alert
          open={isOpen}
          onClose={close}
          heading="점검 안내"
          body="오늘 02:00부터 04:00까지 서비스 점검이 있어요."
          action={<Button onClick={() => close()}>확인</Button>}
        />
      ),
      { overlayId: "maintenance-notice" },
    );

  return <Button onClick={openNotice}>점검 안내 보기</Button>;
}
