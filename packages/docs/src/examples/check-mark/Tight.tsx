"use client";

import { useState } from "react";
import { CheckMark } from "@futurewiz-rms/mint";

export default function Tight() {
  const [currency, setCurrency] = useState("KRW");

  return (
    <div
      role="listbox"
      aria-label="표시 통화"
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}
    >
      {["KRW", "USD", "BTC"].map((code) => (
        <CheckMark
          key={code}
          role="option"
          tight
          checked={currency === code}
          onClick={() => setCurrency(code)}
          className="w-full"
        >
          {code}
        </CheckMark>
      ))}
    </div>
  );
}
