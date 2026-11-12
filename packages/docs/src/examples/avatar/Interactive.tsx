"use client";

import { useState } from "react";
import { Avatar } from "@futurewiz-rms/mint";

export default function Interactive() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Avatar name="김민수" badge={count} onClick={() => setCount((previous) => previous + 1)} />
      <Avatar name="김민수" disabled onClick={() => setCount((previous) => previous + 1)} />
    </>
  );
}
