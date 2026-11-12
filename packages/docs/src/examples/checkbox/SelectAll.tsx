"use client";

import { useState } from "react";
import { Checkbox } from "@futurewiz-rms/mint";

const terms = [
  { id: "service", label: "서비스 이용약관 동의 (필수)" },
  { id: "privacy", label: "개인정보 수집·이용 동의 (필수)" },
  { id: "marketing", label: "마케팅 정보 받기 (선택)" },
];

export default function SelectAll() {
  const [agreed, setAgreed] = useState<string[]>([]);
  const all = agreed.length === terms.length;

  const toggle = (id: string) =>
    setAgreed((previous) =>
      previous.includes(id) ? previous.filter((agreedId) => agreedId !== id) : [...previous, id],
    );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Checkbox
        bold
        checked={all}
        indeterminate={agreed.length > 0 && !all}
        onChange={(event) => setAgreed(event.target.checked ? terms.map((term) => term.id) : [])}
      >
        전체 동의
      </Checkbox>
      {terms.map((term) => (
        <Checkbox key={term.id} checked={agreed.includes(term.id)} onChange={() => toggle(term.id)}>
          {term.label}
        </Checkbox>
      ))}
    </div>
  );
}
