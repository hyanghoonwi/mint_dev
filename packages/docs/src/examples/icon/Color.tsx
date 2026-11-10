import { CheckCircleIcon, WarningCircleIcon } from "@futurewiz-rms/mint";

export default function Color() {
  return (
    <>
      <CheckCircleIcon className="text-icon-brand" variant="fill" />
      <WarningCircleIcon className="text-icon-danger" variant="fill" />
      <WarningCircleIcon className="text-icon-secondary" />
    </>
  );
}
