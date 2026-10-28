import { CheckCircleIcon, WarningCircleIcon } from "@futurewiz-rms/mint";

export default function Color() {
  return (
    <>
      <CheckCircleIcon className="text-brand-primary" variant="fill" />
      <WarningCircleIcon className="text-brand-error" variant="fill" />
      <WarningCircleIcon className="text-text-secondary" />
    </>
  );
}
