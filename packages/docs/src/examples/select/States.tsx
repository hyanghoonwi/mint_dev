import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
];

export default function States() {
  return (
    <>
      <Select label="필수" options={markets} required />
      <Select label="오류" helper="시장을 골라 주세요" options={markets} status="negative" />
      <Select
        label="확인 완료"
        helper="사용할 수 있어요"
        options={markets}
        defaultValue="krw"
        status="positive"
      />
      <Select label="비활성" options={markets} defaultValue="btc" disabled />
      <Select label="읽기 전용" options={markets} defaultValue="btc" readOnly />
    </>
  );
}
