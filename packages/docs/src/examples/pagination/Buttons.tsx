"use client";

import { useState } from "react";
import { Pagination, Text } from "@futurewiz-rms/mint";

export default function Buttons() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Text variant="body-3-regular" color="secondary">
        게시글 {page}페이지
      </Text>
      <Pagination page={page} total={20} onChange={setPage} />
    </div>
  );
}
