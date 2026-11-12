"use client";

import { useState } from "react";
import { Radio, RadioGroup, Text } from "@futurewiz-rms/mint";

const fees = { card: "수수료 2%", bank: "수수료 없음", point: "포인트 차감" };

export default function Controlled() {
  const [method, setMethod] = useState<keyof typeof fees>("card");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <RadioGroup
        aria-label="결제 수단"
        value={method}
        onChange={(value) => setMethod(value as keyof typeof fees)}
      >
        <Radio value="card">카드</Radio>
        <Radio value="bank">계좌이체</Radio>
        <Radio value="point">포인트</Radio>
      </RadioGroup>
      <Text variant="body-3-regular" color="secondary">
        {fees[method]}
      </Text>
    </div>
  );
}
