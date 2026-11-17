import { Select } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    // name을 주면 폼을 제출할 때 고른 값이 그대로 넘어가요
    <form>
      <Select
        label="알림 시장"
        options={[
          { value: "krw", label: "원화" },
          { value: "btc", label: "BTC" },
          { value: "usdt", label: "USDT" },
        ]}
        defaultValue={["krw"]}
        multiple
        name="markets"
      />
    </form>
  );
}
