import { GlobeIcon, Select } from "@futurewiz-rms/mint";

export default function DescriptionAndGroups() {
  return (
    <Select
      label="시장"
      leadingIcon={<GlobeIcon />}
      options={[
        {
          group: "법정화폐",
          options: [{ value: "krw", label: "원화", description: "원화로 거래해요" }],
        },
        {
          group: "코인",
          options: [
            { value: "btc", label: "BTC", description: "비트코인" },
            { value: "eth", label: "ETH", disabled: true },
          ],
        },
      ]}
      defaultValue="krw"
      open
    />
  );
}
