"use client";

import { Alert, Button, useOverlay } from "@futurewiz-rms/mint";

export default function Stacked() {
  const overlay = useOverlay();

  const confirmLeave = () =>
    overlay.open(({ isOpen, close }) => (
      <Alert
        open={isOpen}
        onClose={close}
        heading="정말 탈퇴할까요?"
        body="탈퇴하면 관심 코인과 알림 설정이 모두 사라져요."
        action={
          <>
            <Button color="secondary" onClick={() => close()}>
              돌아가기
            </Button>
            <Button color="destructive" onClick={() => overlay.closeAll()}>
              탈퇴
            </Button>
          </>
        }
      />
    ));

  const openNotice = () =>
    overlay.open(({ isOpen, close }) => (
      <Alert
        open={isOpen}
        onClose={close}
        heading="탈퇴 안내"
        body="탈퇴 전에 보유 자산을 확인해 주세요."
        action={
          <>
            <Button color="secondary" onClick={() => close()}>
              닫기
            </Button>
            <Button onClick={confirmLeave}>계속</Button>
          </>
        }
      />
    ));

  return <Button onClick={openNotice}>탈퇴하기</Button>;
}
