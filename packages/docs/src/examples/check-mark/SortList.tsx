"use client";

import { useState } from "react";
import { CheckMark } from "@futurewiz-rms/mint";

const options = ["최신순", "인기순", "가격 높은순", "가격 낮은순"];

export default function SortList() {
  const [sort, setSort] = useState(options[0]);

  return (
    <div
      role="radiogroup"
      aria-label="정렬"
      style={{ display: "flex", flexDirection: "column", width: 240 }}
    >
      {options.map((label) => (
        <CheckMark
          key={label}
          checked={sort === label}
          role="radio"
          onClick={() => setSort(label)}
          className="w-full"
        >
          {label}
        </CheckMark>
      ))}
    </div>
  );
}
