import { MagnifyingGlassIcon, TrashIcon } from "@futurewiz-rms/mint";

// 아이콘만으로 뜻을 전하는 곳에는 aria-label을 줍니다. 글자가 옆에 있는 장식용 아이콘에는 주지 않습니다.
export default function Label() {
  return (
    <>
      <MagnifyingGlassIcon aria-label="검색" />
      <TrashIcon aria-label="삭제" />
    </>
  );
}
