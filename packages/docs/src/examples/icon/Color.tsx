import { CheckCircleIcon, WarningCircleIcon } from "@futurewiz-rms/mint";

export default function Color() {
  return (
    <>
      <CheckCircleIcon variant="fill" className="text-icon-brand" />
      <WarningCircleIcon variant="fill" className="text-icon-danger" />
      <WarningCircleIcon className="text-icon-secondary" />
    </>
  );
}
