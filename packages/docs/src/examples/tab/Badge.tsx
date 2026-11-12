import { Tab } from "@futurewiz-rms/mint";

export default function Badge() {
  return (
    <Tab
      aria-label="알림"
      items={[
        { value: "all", label: "전체" },
        { value: "notice", label: "공지", badge: true },
        { value: "event", label: "이벤트" },
      ]}
    />
  );
}
