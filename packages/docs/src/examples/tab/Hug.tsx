import { Tab } from "@futurewiz-rms/mint";

export default function Hug() {
  return (
    <Tab
      aria-label="고객센터"
      layout="hug"
      items={[
        { value: "home", label: "홈" },
        { value: "market", label: "시세" },
        { value: "assets", label: "내 자산" },
        { value: "exchange", label: "거래소" },
        { value: "wallet", label: "입출금" },
        { value: "support", label: "고객센터" },
      ]}
    />
  );
}
