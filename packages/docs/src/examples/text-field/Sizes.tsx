import { TextField } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <>
      <TextField size="lg" label="Large 48" defaultValue="입력한 내용" />
      <TextField size="md" label="Medium 40" defaultValue="입력한 내용" />
      <TextField size="sm" label="Small 32" defaultValue="입력한 내용" />
    </>
  );
}
