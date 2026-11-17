"use client";
import { useState } from "react";
import { Textarea, TextButton } from "@futurewiz-rms/mint";
export default function Addon() {
  const [value, setValue] = useState("");
  return (
    <Textarea
      label="문의 내용"
      placeholder="내용을 입력해 주세요"
      addon={
        <TextButton size="sm" disabled={!value} onClick={() => setValue("")}>
          비우기
        </TextButton>
      }
      value={value}
      counter
      maxLength={500}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
