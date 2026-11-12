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
          <Thumbnail src={item.image} alt="" aspectRatio="4:3" radius style={{ width: 80 }} />
          <div>
            <Text as="p" variant="body-3-medium" color="strong">
              {item.title}
            </Text>
            <Text as="p" variant="caption-1-regular" color="tertiary">
              {item.time}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
