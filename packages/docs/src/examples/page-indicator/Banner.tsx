import { PageDots } from "@futurewiz-rms/mint";

export default function Banner() {
  return (
    <div
      className="bg-fill-neutral rounded-16"
      style={{
        position: "relative",
        width: 320,
        height: 160,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 12,
      }}
    >
      {/* 배너 이미지 위: white */}
      <PageDots variant="white" current={2} total={4} />
    </div>
  );
}
