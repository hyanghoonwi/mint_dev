import { Text, Thumbnail } from "@futurewiz-rms/mint";

// 실제로는 서버에서 받은 이미지 주소를 넣어요
const news = [
  { title: "비트코인 ETF 순유입 지속", time: "10분 전", image: "" },
  { title: "이더리움 업그레이드 일정 확정", time: "32분 전", image: "" },
  { title: "국내 거래소 거래량 증가", time: "1시간 전", image: "" },
];

export default function List() {
  return (
    <div
      style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {news.map((item) => (
        <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Thumbnail radius aspectRatio="4:3" src={item.image} alt="" style={{ width: 80 }} />
          <div>
            <Text variant="body-3-medium" color="strong" as="p">
              {item.title}
            </Text>
            <Text variant="caption-1-regular" color="tertiary" as="p">
              {item.time}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
