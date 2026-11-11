"use client";

import { useState } from "react";
import { FramedRadio, RadioGroup } from "@futurewiz-rms/mint";

export default function Plan() {
  const [plan, setPlan] = useState("pro");

  return (
    <RadioGroup
      aria-label="요금제"
      value={plan}
      onChange={setPlan}
      className="gap-2"
      style={{ width: 360, maxWidth: "100%" }}
    >
      <FramedRadio value="basic" label="베이직" description="월 9,900원 · 시세 알림 10개" />
      <FramedRadio value="pro" label="프로" description="월 19,900원 · 시세 알림 무제한" />
      <FramedRadio value="team" label="팀" description="여러 명이 함께 쓰는 요금제 · 문의 필요" />
    </RadioGroup>
  );
}
