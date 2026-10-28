import { Grid } from "@futurewiz-rms/mint";

// 모바일 1개/줄, 태블릿 2개/줄, 데스크톱 4개/줄. 브라우저 창 폭을 바꿔 보세요.
export default function Cards() {
  return (
    <Grid>
      {Array.from({ length: 8 }, (_, index) => (
        <Grid.Item key={index} span={{ base: 4, tablet: 4, desktop: 3 }}>
          <div className="rounded-8 bg-brand-tint p-5 text-label-2-semibold text-brand-primary">
            카드 {index + 1}
          </div>
        </Grid.Item>
      ))}
    </Grid>
  );
}
