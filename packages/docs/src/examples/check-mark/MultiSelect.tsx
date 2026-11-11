"use client";

import { useState } from "react";
import { CheckMark } from "@futurewiz-rms/mint";

const exchanges = ["업비트", "빗썸", "코인원", "코빗"];

export default function MultiSelect() {
  const [selected, setSelected] = useState<string[]>(["업비트"]);
  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  return (
    <div
      role="group"
      aria-label="거래소"
      style={{ display: "flex", flexDirection: "column", width: 240 }}
    >
      {exchanges.map((name) => (
        <CheckMark
          key={name}
          checked={selected.includes(name)}
          onClick={() => toggle(name)}
          className="w-full"
        >
          {name}
        </CheckMark>
      ))}
    </div>
  );
}
