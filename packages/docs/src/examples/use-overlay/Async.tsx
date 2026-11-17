"use client";

import { useState } from "react";
import { Alert, Box, Button, Text, useOverlay } from "@futurewiz-rms/mint";

export default function Async() {
  const overlay = useOverlay();
  const [message, setMessage] = useState("");

  const deletePost = async () => {
    const confirmed = await overlay.openAsync<boolean>(({ isOpen, close }) => (
      <Alert
        heading="게시글을 삭제할까요?"
        body="삭제한 글은 되돌릴 수 없어요."
        action={
          <>
            <Button color="secondary" onClick={() => close(false)}>
              취소
            </Button>
            <Button color="destructive" onClick={() => close(true)}>
              삭제
            </Button>
          </>
        }
        open={isOpen}
        onClose={() => close(false)}
      />
    ));
    setMessage(confirmed ? "삭제했어요" : "취소했어요");
  };

  return (
    <Box direction="horizontal" align="center" gap={12}>
      <Button color="destructive" onClick={deletePost}>
        게시글 삭제
      </Button>
      <Text variant="body-2-regular" color="secondary">
        {message}
      </Text>
    </Box>
  );
}
