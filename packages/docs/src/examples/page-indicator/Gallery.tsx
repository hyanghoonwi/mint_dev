import { PageCounter } from "@futurewiz-rms/mint";

export default function Gallery() {
  return (
    <div
      className="bg-fill-neutral-medium rounded-16"
      style={{ position: "relative", width: 320, height: 200 }}
    >
      {/* 이미지가 많은 갤러리: 오른쪽 아래에 숫자 */}
      <PageCounter
        current={3}
        total={24}
        size="sm"
        style={{ position: "absolute", right: 12, bottom: 12 }}
      />
    </div>
  );
}
