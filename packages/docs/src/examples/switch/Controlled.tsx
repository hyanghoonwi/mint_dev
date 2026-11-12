"use client";

import { useState } from "react";
import { Switch, Text } from "@futurewiz-rms/mint";

export default function Controlled() {
  const [notify, setNotify] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Switch checked={notify} onChange={(event) => setNotify(event.target.checked)}>
        알림 받기
      </Switch>
      <Text as="p" variant="body-3-regular" color="secondary">
        {notify ? "알림이 켜져 있어요" : "알림이 꺼져 있어요"}
      </Text>
    </div>
  );
}
