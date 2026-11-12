"use client";

import { useState } from "react";
import { Category, Text } from "@futurewiz-rms/mint";

const coins = [
  { name: "비트코인", type: "major" },
  { name: "이더리움", type: "major" },
  { name: "유니스왑", type: "defi" },
  { name: "도지코인", type: "meme" },
];

export default function Filter() {
  const [type, setType] = useState("all");
  const shown = type === "all" ? coins : coins.filter((coin) => coin.type === type);

  return (
    <div style={{ width: 360, maxWidth: "100%" }}>
      <Category
        aria-label="코인 분류"
        value={type}
        onChange={setType}
        items={[
          { value: "major", label: "메이저" },
          { value: "defi", label: "디파이" },
          { value: "meme", label: "밈" },
        ]}
      />
      <ul className="bg-background-default px-4 pb-4">
        {shown.map((coin) => (
          <li key={coin.name} style={{ padding: "8px 0" }}>
            <Text variant="body-3-regular">{coin.name}</Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
