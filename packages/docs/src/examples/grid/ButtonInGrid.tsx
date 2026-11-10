import { Button, Grid } from "@futurewiz-rms/mint";

// 모바일에서는 한 줄 전체, 태블릿·데스크톱에서는 3컬럼을 차지하는 버튼
export default function ButtonInGrid() {
  return (
    <Grid>
      <Grid.Item span={{ base: 4, tablet: 3, desktop: 3 }}>
        <Button fullWidth>저장</Button>
      </Grid.Item>
    </Grid>
  );
}
