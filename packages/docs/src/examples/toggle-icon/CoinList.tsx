"use client";

import { useState } from "react";
import { StarIcon, Text, ToggleIcon } from "@futurewiz-rms/mint";

const coins = ["비트코인", "이더리움", "리플"];

export default function CoinList() {
  const [favorites, setFavorites] = useState<string[]>(["비트코인"]);

  return (
    <div className="bg-background-default rounded-16" style={{ width: 320, padding: "8px 12px" }}>
      {coins.map((coin) => (
        <div key={coin} style={{ display: "flex", alignItems: "center", gap: 8, height: 48 }}>
          <Text variant="body-3-medium" color="strong" style={{ flex: 1 }}>
            {coin}
          </Text>
          <ToggleIcon
            icon={<StarIcon />}
            aria-label={`${coin} 관심 코인`}
            size="sm"
            active={favorites.includes(coin)}
            onActiveChange={(on) =>
              setFavorites((prev) => (on ? [...prev, coin] : prev.filter((c) => c !== coin)))
            }
          />
        </div>
      ))}
    </div>
  );
}
