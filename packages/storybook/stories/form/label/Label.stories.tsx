import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Label, QuestionIcon, Tooltip } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "라벨" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    helpIcon: { control: "boolean" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma Size: Large 16 · Medium 14(기본) · Small 12
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <Label {...args} size="lg" />
      <Label {...args} size="md" />
      <Label {...args} size="sm" />
    </div>
  ),
};

// Figma required = true: 글자 옆에 빨간 *
export const Required: Story = {
  args: { required: true },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <Label {...args} size="lg" />
      <Label {...args} size="md" />
      <Label {...args} size="sm" />
    </div>
  ),
};

// Figma help icon = true: 글자 오른쪽 물음표 아이콘(16)
export const HelpIcon: Story = {
  args: { helpIcon: true },
};

// 누르면 설명이 나오게: 아이콘 버튼을 Tooltip으로 감싸서 직접 넘긴다
export const HelpIconWithTooltip: Story = {
  args: {
    helpIcon: (
      <Tooltip label="가입할 때 쓴 이름이에요">
        <button type="button" aria-label="이름 도움말" style={{ display: "inline-flex" }}>
          <QuestionIcon size={16} />
        </button>
      </Tooltip>
    ),
  },
};

// Figma state = disabled: 글자와 아이콘이 흐려진다(필수 표시의 빨강은 그대로)
export const Disabled: Story = {
  args: { disabled: true, required: true, helpIcon: true },
};

// 화면 폭에 따라 크기가 바뀐다(툴바의 뷰포트로 확인)
export const Responsive: Story = {
  args: { size: { base: "md", desktop: "lg" } },
};

// 입력 칸과 이어 두면 라벨을 눌러도 입력 칸에 포커스가 간다
export const WithInput: Story = {
  args: { required: true, htmlFor: "name" },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 280 }}>
      <Label {...args}>이름</Label>
      <input id="name" placeholder="홍길동" style={{ border: "1px solid #ccc", padding: 8 }} />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("이름"));
    await expect(canvas.getByPlaceholderText("홍길동")).toHaveFocus();
    await expect(canvas.getByText("(필수)")).toBeInTheDocument();
  },
};
