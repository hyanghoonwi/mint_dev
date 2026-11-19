"use client";
import { useState } from "react";
import { Box, Button, ProgressBar, Text } from "@futurewiz-rms/mint";

// 파일 업로드처럼 끝이 있는 작업: 진행률(percent)을 상태로 들고 value에 넘겨요. 숫자는 옆에 Text로 보여 줘요
export default function Upload() {
  const [percent, setPercent] = useState(40);
  const done = percent >= 100;

  return (
    <Box gap={12} className="w-full">
      <Box direction="horizontal" align="center" justify="between" gap={8}>
        <Text variant="body-3-medium" color="strong">
          report.pdf
        </Text>
        <Text variant="body-3-medium" color={done ? "success" : "secondary"}>
          {done ? "완료" : `${percent}%`}
        </Text>
      </Box>
      <ProgressBar
        value={percent}
        status={done ? "positive" : "normal"}
        aria-label="report.pdf 업로드 진행"
      />
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        onClick={() => setPercent((previous) => Math.min(previous + 20, 100))}
      >
        20% 올리기
      </Button>
    </Box>
  );
}
