import type { Meta, StoryObj } from "@storybook/react-vite";
import * as mint from "@futurewiz-rms/mint";
import {
  ArrowRightIcon,
  BellIcon,
  Box,
  Button,
  CheckCircleIcon,
  CheckIcon,
  HeartIcon,
  HouseIcon,
  iconCatalog,
  type IconComponent,
  PlusIcon,
  SelectedCheckIcon,
  StarIcon,
  Text,
  WarningCircleIcon,
} from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Display/Icon",
  component: HouseIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["line", "fill"] },
    size: { control: "inline-radio", options: [16, 20, 24] },
  },
  args: { variant: "line", size: 24 },
} satisfies Meta<typeof HouseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 16 · 20 · 24px. 16과 20은 24px 아이콘을 비율대로 줄인 것이다
export const Sizes: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={16}>
      <HouseIcon size={16} />
      <HouseIcon size={20} />
      <HouseIcon size={24} />
    </Box>
  ),
};

// 선(line, Regular 굵기)과 채움(fill)
export const Variants: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={16}>
      <HeartIcon variant="line" />
      <HeartIcon variant="fill" />
      <StarIcon variant="line" />
      <StarIcon variant="fill" />
      <BellIcon variant="line" />
      <BellIcon variant="fill" />
    </Box>
  ),
};

// 색은 글자색을 따라간다. 글자색 토큰 클래스로 지정한다
export const Colors: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={16}>
      <CheckCircleIcon variant="fill" className="text-icon-brand" />
      <WarningCircleIcon variant="fill" className="text-icon-danger" />
      <WarningCircleIcon className="text-icon-secondary" />
    </Box>
  ),
};

// 버튼 안의 아이콘은 버튼 크기에 맞게 자동으로 조절된다
export const InButton: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      <Button size="sm" leftAddon={<PlusIcon />}>
        추가
      </Button>
      <Button leftAddon={<PlusIcon />}>추가</Button>
      <Button variant="outline" size="lg" rightAddon={<ArrowRightIcon />}>
        더보기
      </Button>
    </Box>
  ),
};

const icons = mint as unknown as Record<string, IconComponent>;
const componentName = (name: string) =>
  `${name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}Icon`;

// Figma 가이드의 분류대로 183개 전체. 왼쪽이 line, 오른쪽이 fill
export const Gallery: Story = {
  parameters: {
    layout: "padded",
    // 코드 패널에는 갤러리를 그리는 코드가 아니라, 사용하는 쪽이 쓰는 코드를 보여 준다
    docs: {
      source: {
        code: `import { ArrowLeftIcon } from "@futurewiz-rms/mint";

<ArrowLeftIcon size={20} variant="fill" />`,
      },
    },
  },
  render: () => (
    <Box gap={32}>
      {iconCatalog.map((group) => (
        <section key={group.category} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Text variant="heading-3-bold" as="h3" style={{ margin: 0 }}>
            {group.category}
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
              gap: 8,
            }}
          >
            {group.icons.map((name) => {
              const Icon = icons[componentName(name)];
              return (
                <div
                  key={name}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                >
                  <div
                    className="rounded-8 bg-background-lower"
                    style={{ display: "flex", gap: 8, padding: 12 }}
                  >
                    <Icon />
                    <Icon variant="fill" />
                  </div>
                  <Text variant="caption-1-regular" color="secondary" as="code">
                    {name}
                  </Text>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </Box>
  ),
};

// Phosphor 목록에 없는 전용 아이콘: 고른 항목 끝의 체크(20px, 선 2). 얇은 CheckIcon과 굵기를 견준다
export const SelectedCheck: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={16}>
      <CheckIcon size={20} className="text-icon-brand" />
      <SelectedCheckIcon className="text-icon-brand" />
    </Box>
  ),
};
