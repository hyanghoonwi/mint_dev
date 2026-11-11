"use client";

import { useState } from "react";
import { Chip } from "@futurewiz-rms/mint";

const periods = ["1일", "1주", "1개월", "1년"];

export default function SingleFilter() {
  const [period, setPeriod] = useState(periods[0]);

  return (
    <div role="group" aria-label="기간" style={{ display: "flex", gap: 8 }}>
      {periods.map((label) => (
        <Chip key={label} shape="pill" active={period === label} onClick={() => setPeriod(label)}>
          {label}
        </Chip>
      ))}
    </div>
  );
}
