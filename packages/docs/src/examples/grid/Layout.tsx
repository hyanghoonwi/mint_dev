import { Container, Grid } from "@futurewiz-rms/mint";

// 페이지 틀: 데스크톱에서는 왼쪽 3컬럼 + 오른쪽 9컬럼, 태블릿·모바일에서는 위아래로 쌓입니다.
export default function Layout() {
  return (
    <Container>
      <Grid>
        <Grid.Item span={{ base: 4, tablet: 8, desktop: 3 }}>
          <aside className="rounded-8 bg-background-lower p-5 text-body-3-medium">사이드</aside>
        </Grid.Item>
        <Grid.Item span={{ base: 4, tablet: 8, desktop: 9 }}>
          <main className="rounded-8 bg-background-lower p-5 text-body-3-medium">본문</main>
        </Grid.Item>
      </Grid>
    </Container>
  );
}
