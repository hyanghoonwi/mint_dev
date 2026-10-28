import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Grid } from "@futurewiz-rms/mint";

const meta = {
  title: "Foundations/Grid",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 툴바의 뷰포트(Mobile 360 · Tablet 768 · Desktop 1024 · 1440)를 바꿔 가며 확인한다.
// 컬럼 수는 4 → 8 → 12로 바뀌고 거터와 좌우 여백은 20px 그대로다. 사용법은 Components/Layout/Grid를 본다.
export const Columns: Story = {
  render: () => (
    <div style={{ background: "var(--mint-bg-elevated)", padding: "24px 0" }}>
      {/* 칸은 12개를 만들어 두고 첫 줄만 보이게 해서(나머지 줄은 높이 0) 현재 구간의 컬럼 수만 나오게 한다 */}
      <Container>
        <Grid style={{ gridTemplateRows: "96px", gridAutoRows: 0, overflow: "hidden" }}>
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
      </Container>
    </div>
  ),
  // 코드 패널에는 갤러리를 그리는 코드가 아니라, 사용하는 쪽이 쓰는 코드를 보여 준다
  parameters: {
    docs: {
      source: {
        code: `<Container>
  <Grid>
    <Grid.Item span={{ base: 4, tablet: 4, desktop: 3 }}>…</Grid.Item>
  </Grid>
</Container>`,
      },
    },
  },
};
