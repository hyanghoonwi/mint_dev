import { Grid } from "@futurewiz-rms/mint";

// 현재 구간의 컬럼 수(4 · 8 · 12)만큼 칸을 보여 주는 시각 확인용 예시. 코드는 숨기고 사용법은 문서 본문에 적는다.
// 칸은 12개를 만들어 두고 첫 줄만 보이게 해서(나머지 줄은 높이 0) 구간의 컬럼 수만 나오게 한다.
export default function Preview() {
  return (
    <Grid style={{ gridTemplateRows: "64px", gridAutoRows: 0, overflow: "hidden", width: "100%" }}>
      {Array.from({ length: 12 }, (_, index) => (
        <Grid.Item
          key={index}
          span={{ base: 1 }}
          className="rounded-4 bg-brand-tint text-label-3-semibold text-brand-primary"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {index + 1}
        </Grid.Item>
      ))}
    </Grid>
  );
}
