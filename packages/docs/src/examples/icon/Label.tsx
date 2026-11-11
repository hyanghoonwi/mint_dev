import { MagnifyingGlassIcon, TrashIcon } from "@futurewiz-rms/mint";

// 아이콘만으로 뜻을 전하는 곳에는 aria-label을 줘요. 글자가 옆에 있는 장식용 아이콘에는 주지 않아요.
export default function Label() {
  return (
    <>
      <MagnifyingGlassIcon aria-label="검색" />
      <TrashIcon aria-label="삭제" />
    </>
  );
}
