import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Grid } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Layout/Grid",
  component: Grid,
  subcomponents: { "Grid.Item": Grid.Item, Container },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// 모바일 1개/줄, 태블릿 2개/줄, 데스크톱 4개/줄. 툴바의 뷰포트를 바꿔 가며 확인한다
export const Cards: Story = {
  render: () => (
    <Container>
      <Grid>
        {Array.from({ length: 8 }, (_, index) => (
          <Grid.Item key={index} span={{ base: 4, tablet: 4, desktop: 3 }}>
            <div className="rounded-8 bg-fill-brand-weak p-5 text-label-2-semibold text-text-brand">
              카드 {index + 1}
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </Container>
  ),
};

// 데스크톱에서는 왼쪽 3컬럼 + 오른쪽 9컬럼, 태블릿·모바일에서는 위아래로 쌓인다
export const PageLayout: Story = {
  render: () => (
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
  ),
};

// span을 생략하면 한 줄을 모두 차지한다
export const FullRow: Story = {
  render: () => (
    <Container>
      <Grid>
        <Grid.Item>
          <div className="rounded-8 bg-background-lower p-5 text-body-3-medium">한 줄 전체</div>
        </Grid.Item>
      </Grid>
    </Container>
  ),
};
