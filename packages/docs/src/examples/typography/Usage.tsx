export default function Usage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
      <h2 className="text-title-2-bold text-text-primary" style={{ margin: 0 }}>
        오늘의 시세
      </h2>
      <p className="text-body-2-regular text-text-secondary" style={{ margin: 0 }}>
        역할 스타일 클래스 하나로 크기, 줄 간격, 자간, 웨이트가 함께 정해집니다.
      </p>
      <span className="text-caption-1-regular text-text-caption">2026-10-28 업데이트</span>
    </div>
  );
}
