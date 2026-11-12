import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Framed, FramedCheckbox, FramedRadio, RadioGroup, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Framed",
  component: FramedCheckbox,
  subcomponents: { FramedRadio, Framed },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "텍스트", description: "설명", onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    error: { control: "boolean" },
    shadow: { control: "boolean" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FramedCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: "flex", flexDirection: "column", gap: 8 } as const;

export const Checkbox: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      <FramedCheckbox {...args} size="sm" label="Small" />
      <FramedCheckbox {...args} size="md" label="Medium" />
      <FramedCheckbox {...args} size="lg" label="Large" />
    </div>
  ),
};

// 선택 · 오류 · 비활성 · 그림자
export const States: Story = {
  render: (args) => (
    <div style={column}>
      <FramedCheckbox {...args} label="선택 안 됨" />
      <FramedCheckbox {...args} label="선택됨" defaultChecked />
      <FramedCheckbox {...args} label="오류" error />
      <FramedCheckbox {...args} label="오류 · 선택됨" error defaultChecked />
      <FramedCheckbox {...args} label="비활성" disabled />
      <FramedCheckbox {...args} label="비활성 · 선택됨" disabled defaultChecked />
      <FramedCheckbox {...args} label="그림자" shadow />
    </div>
  ),
};

export const Radio: Story = {
  render: () => (
    <RadioGroup aria-label="요금제" defaultValue="basic" className="gap-2">
      <FramedRadio value="basic" label="베이직" description="월 9,900원 · 시세 알림 10개" />
      <FramedRadio value="pro" label="프로" description="월 19,900원 · 시세 알림 무제한" />
      <FramedRadio value="team" label="팀" description="문의 필요" disabled />
    </RadioGroup>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div style={column}>
      <Framed>
        <Text variant="body-2-regular">다른 내용을 담는 틀</Text>
      </Framed>
      <Framed selected size="lg" shadow>
        <Text variant="body-2-regular">선택된 틀</Text>
      </Framed>
    </div>
  ),
};

// 틀 어디를 눌러도(설명 글자 포함) 체크가 바뀐다
export const ClickAnywhere: Story = {
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole("checkbox", { name: /텍스트/ });
    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText("설명"));
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

// 라디오 틀: 하나만 선택되고 방향키로 옮긴다
export const RadioSelectOne: Story = {
  render: function Render() {
    const [plan, setPlan] = useState("basic");
    return (
      <div style={column}>
        <RadioGroup aria-label="요금제" value={plan} onChange={setPlan} className="gap-2">
          <FramedRadio value="basic" label="베이직" description="월 9,900원" />
          <FramedRadio value="pro" label="프로" description="월 19,900원" />
        </RadioGroup>
        <output>{plan}</output>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const radio = (name: RegExp) => canvas.getByRole("radio", { name });
    await userEvent.click(canvas.getByText("월 19,900원"));
    await expect(radio(/프로/)).toBeChecked();
    await expect(radio(/베이직/)).not.toBeChecked();
    await expect(canvas.getByRole("status")).toHaveTextContent("pro");
    await userEvent.keyboard("{ArrowUp}");
    await expect(radio(/베이직/)).toBeChecked();
  },
};

// error: 빨간 테두리 + 입력에 aria-invalid
export const Error: Story = {
  args: { error: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: /텍스트/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  },
};

export const DisabledNotClickable: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByText("설명"), { pointerEventsCheck: 0 });
    await expect(canvas.getByRole("checkbox", { name: /텍스트/ })).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
