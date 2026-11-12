import { Text, Thumbnail } from "@futurewiz-rms/mint";

// 실제로는 서버에서 받은 이미지 주소를 넣어요. 비어 있으면 회색 바탕에 이미지 아이콘이 보여요
const news = { title: "비트코인 ETF 순유입 지속", image: "", date: "2026.11.12 · 크립토랩 리서치" };

export default function Card() {
  return (
    <div
      style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <Thumbnail src={news.image} alt={news.title} aspectRatio="16:9" radius />
      <div>
        <Text as="p" variant="body-2-semibold" color="strong">
          {news.title}
        </Text>
        <Text as="p" variant="caption-1-regular" color="tertiary">
          {news.date}
        </Text>
      </div>
    </div>
  );
}
