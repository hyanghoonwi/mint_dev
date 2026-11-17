import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
];

export default function Responsive() {
  return (
    // 모바일·태블릿은 라벨이 위·칸 48(lg), 데스크톱(1024px~)부터 라벨이 왼쪽·칸 40(md)
    <Select
      size={{ base: "lg", desktop: "md" }}
      label="시장"
      helper="창 폭을 바꿔 보세요"
      options={markets}
      defaultValue="krw"
      labelPosition={{ base: "top", desktop: "left" }}
    />
  );
}
