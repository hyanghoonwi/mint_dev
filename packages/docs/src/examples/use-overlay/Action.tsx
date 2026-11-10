"use client";

import { useState } from "react";
import { Alert, Button, useOverlay } from "@futurewiz-rms/mint";

export default function Action() {
  const overlay = useOverlay();
  const [deleted, setDeleted] = useState(false);

  const confirmDelete = () =>
    overlay.open(({ isOpen, close }) => (
      <Alert
        open={isOpen}
        onClose={close}
        heading="게시글을 삭제할까요?"
        body="삭제한 글은 되돌릴 수 없어요."
        action={
          <>
            <Button color="secondary" onClick={() => close()}>
              취소
            </Button>
            <Button
              color="destructive"
              onClick={() => {
                setDeleted(true);
                close();
              }}
            >
              삭제
            </Button>
          </>
        }
      />
    ));

  return (
    <Button color="destructive" disabled={deleted} onClick={confirmDelete}>
      {deleted ? "삭제했어요" : "게시글 삭제"}
    </Button>
  );
}
