// 모바일·태블릿은 md(행 48), 넓게 배치하는 데스크톱은 lg(행 56). 폭은 부모가 정해요.
import { Calendar } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    <Calendar
      size={{ base: "md", desktop: "lg" }}
      today="2026-11-11"
      marks={{ "2026-11-12": [{ color: "brand" }], "2026-11-20": [{ color: "danger" }] }}
      style={{ maxWidth: 400 }}
    />
  );
}
