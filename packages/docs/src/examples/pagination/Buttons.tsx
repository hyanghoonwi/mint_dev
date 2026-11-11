"use client";

import { useState } from "react";
import { Pagination } from "@futurewiz-rms/mint";

export default function Buttons() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <span className="text-body-3-regular text-text-secondary">게시글 {page}페이지</span>
      <Pagination page={page} total={20} onChange={setPage} />
    </div>
  );
}
