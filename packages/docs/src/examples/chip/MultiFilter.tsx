"use client";

import { useState } from "react";
import { Chip } from "@futurewiz-rms/mint";

const kinds = [
  { id: "signal", label: "시그널", count: 12 },
  { id: "airdrop", label: "에어드랍", count: 3 },
  { id: "notice", label: "공시", count: 5 },
];

export default function MultiFilter() {
  const [on, setOn] = useState<string[]>(["signal"]);
  const toggle = (id: string) =>
    setOn((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );

  return (
    <div role="group" aria-label="알림 종류" style={{ display: "flex", gap: 8 }}>
      {kinds.map((kind) => (
        <Chip
          key={kind.id}
          active={on.includes(kind.id)}
          count={kind.count}
          onClick={() => toggle(kind.id)}
        >
          {kind.label}
        </Chip>
      ))}
    </div>
  );
}
