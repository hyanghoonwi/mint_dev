"use client";

import { useState } from "react";
import { Tab, Text } from "@futurewiz-rms/mint";

export default function Sections() {
  const [section, setSection] = useState("home");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360 }}>
      <Tab
        aria-label="내 정보"
        value={section}
        onChange={setSection}
        items={[
          { value: "home", label: "홈" },
          { value: "market", label: "시세" },
          { value: "assets", label: "내 자산" },
        ]}
      />
      <Text as="p" variant="body-2-regular" color="secondary">
        선택한 탭: {section}
      </Text>
    </div>
  );
}
