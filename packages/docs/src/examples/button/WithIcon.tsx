import { ArrowRightIcon, Button, PencilSimpleIcon } from "@futurewiz-rms/mint";

export default function WithIcon() {
  return (
    <>
      <Button leftAddon={<PencilSimpleIcon />}>글쓰기</Button>
      <Button variant="outline" rightAddon={<ArrowRightIcon />}>
        다음
      </Button>
    </>
  );
}
