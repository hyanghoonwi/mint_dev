"use client";

import { useState } from "react";
import { Text, useDebounceValue } from "@futurewiz-rms/mint";

const coins = [
  "비트코인",
  "비트코인캐시",
  "이더리움",
  "이더리움클래식",
  "리플",
  "솔라나",
  "도지코인",
];

export default function Search() {
  const [query, setQuery] = useState("");
  // 입력창에는 query를, 검색(요청)에는 300ms 멈춘 뒤 확정된 값을 쓴다. Enter는 바로 확정
  const { debouncedValue, isDebouncing, flush } = useDebounceValue(query, 300);
  const results = coins.filter((coin) => coin.includes(debouncedValue.trim()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      <input
        aria-label="코인 검색"
        placeholder="코인 이름"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && flush()}
        className="h-10 rounded-8 border border-border-strong bg-fill-white px-3 text-body-2-regular text-text-primary"
      />
      <Text variant="caption-1-regular" color="tertiary">
        {isDebouncing ? "입력 중…" : `검색어: ${debouncedValue || "(없음)"} · ${results.length}개`}
      </Text>
      {results.map((coin) => (
        <Text key={coin} as="p" variant="body-3-regular">
          {coin}
        </Text>
      ))}
    </div>
  );
}
