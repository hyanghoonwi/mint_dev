"use client";

import { useState } from "react";
import { Chip } from "@futurewiz-rms/mint";

const coins = [
  { symbol: "BTC", color: "#f7931a" },
  { symbol: "ETH", color: "#627eea" },
  { symbol: "XRP", color: "#23292f" },
];

export default function WithImage() {
  const [coin, setCoin] = useState("BTC");

  return (
    <div role="group" aria-label="코인" style={{ display: "flex", gap: 8 }}>
      {coins.map((item) => (
        <Chip
          key={item.symbol}
          variant="outline"
          active={coin === item.symbol}
          // 실제로는 코인 로고 <img src={logo} alt="" />를 넘겨요
          leadingImage={<span style={{ background: item.color }} />}
          onClick={() => setCoin(item.symbol)}
        >
          {item.symbol}
        </Chip>
      ))}
    </div>
  );
}
