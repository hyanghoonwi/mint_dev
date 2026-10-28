import { Button, PlusIcon, ArrowRightIcon } from "@futurewiz-rms/mint";

// 버튼 안의 아이콘은 버튼 크기에 맞게 자동으로 조절됩니다
export default function WithButton() {
  return (
    <>
      <Button size="sm" leftAddon={<PlusIcon />}>
        추가
      </Button>
      <Button leftAddon={<PlusIcon />}>추가</Button>
      <Button size="lg" variant="line" rightAddon={<ArrowRightIcon />}>
        더보기
      </Button>
    </>
  );
}
