import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Display/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { variant: "body-2-regular", children: "비트코인이 1억을 넘었어요" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display-1-bold",
        "title-1-bold",
        "title-3-semibold",
        "heading-2-semibold",
        "body-1-regular",
        "body-2-regular",
        "body-4-medium",
        "label-2-semibold",
        "caption-1-regular",
      ],
    },
    color: {
      control: "select",
      options: [undefined, "strong", "primary", "secondary", "tertiary", "brand", "danger"],
    },
    lines: { control: "inline-radio", options: [undefined, 1, 2, 3, 4] },
    as: { control: "text" },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 역할별 대표 스타일
export const Roles: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Text variant="display-3-bold">Display 3 · 히어로</Text>
      <Text variant="title-1-bold">Title 1 · 페이지 제목</Text>
      <Text variant="heading-2-semibold">Heading 2 · 섹션 제목</Text>
      <Text variant="body-2-regular">Body 2 · 기본 본문</Text>
      <Text variant="label-2-semibold">Label 2 · 버튼·칩 라벨</Text>
      <Text variant="caption-1-regular" color="tertiary">
        Caption 1 · 날짜, 도움말
      </Text>
    </div>
  ),
};

// 모양과 태그를 따로: 제목 모양의 p, 본문 모양의 h2
export const TagAndStyle: Story = {
  render: () => (
    <div>
      <Text variant="title-2-bold" as="h1">
        h1 · Title 2
      </Text>
      <Text variant="body-2-regular" as="p" color="secondary">
        p · Body 2
      </Text>
    </div>
  ),
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 1 });
    await expect(heading).toHaveClass("text-title-2-bold");
    await expect(canvas.getByText("p · Body 2").tagName).toBe("P");
  },
};

export const Lines: Story = {
  args: {
    lines: 2,
    children:
      "아주 긴 글은 두 줄에서 잘라 말줄임으로 보여 줘요. 상세 화면에서 전체 글을 볼 수 있게 해 주세요. 이 문장은 줄이 넘치도록 길게 썼어요.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
