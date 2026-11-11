"use client";

import { useState } from "react";
import { ListIcon, SegmentedControl, SquaresFourIcon, Text } from "@futurewiz-rms/mint";

export default function ViewMode() {
  const [view, setView] = useState("list");
  return (
    <>
      <SegmentedControl
        aria-label="보기 방식"
        value={view}
        onChange={setView}
        items={[
          { value: "list", label: "목록", icon: <ListIcon /> },
          { value: "grid", label: "격자", icon: <SquaresFourIcon /> },
        ]}
      />
      <Text variant="body-3-regular" color="secondary">
        {view === "list" ? "코인을 한 줄씩 보여 줘요" : "코인을 카드로 보여 줘요"}
      </Text>
    </>
  );
}
