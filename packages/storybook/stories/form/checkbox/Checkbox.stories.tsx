import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Checkbox } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "텍스트", onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    bold: { control: "boolean" },
    tight: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Unchecked · Checked · Indeterminate × Normal · Disabled (Pressed는 hover·누르는 동안)
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 8 }}>
      <Checkbox>체크 안 됨</Checkbox>
      <Checkbox defaultChecked>체크됨</Checkbox>
      <Checkbox indeterminate>일부 선택</Checkbox>
      <Checkbox disabled>비활성</Checkbox>
      <Checkbox disabled defaultChecked>
        비활성 체크
      </Checkbox>
      <Checkbox disabled indeterminate>
        비활성 일부
      </Checkbox>
    </div>
  ),
};

export const Bold: Story = {
  args: { bold: true, defaultChecked: true, children: "전체 동의" },
};

export const Tight: Story = {
  args: { tight: true },
};

export const BoxOnly: Story = {
  args: { children: undefined, "aria-label": "선택" },
};

// 레이블을 눌러도 선택된다(비제어)
export const LabelClick: Story = {
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "텍스트" });
    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText("텍스트"));
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
  },
};

export const DisabledNotClickable: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByText("텍스트"), { pointerEventsCheck: 0 });
    await expect(canvas.getByRole("checkbox", { name: "텍스트" })).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

const terms = [
  { id: "service", label: "서비스 이용약관 동의" },
  { id: "privacy", label: "개인정보 수집·이용 동의" },
  { id: "marketing", label: "마케팅 정보 받기" },
];

// 전체 선택과 하위 선택을 indeterminate로 연결
export const SelectAll: Story = {
  render: function Render() {
    const [agreed, setAgreed] = useState<string[]>([]);
    const all = agreed.length === terms.length;
    const toggle = (id: string) =>
      setAgreed((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Checkbox
          bold
          checked={all}
          indeterminate={agreed.length > 0 && !all}
          onChange={(event) => setAgreed(event.target.checked ? terms.map((t) => t.id) : [])}
        >
          전체 동의
        </Checkbox>
        {terms.map((term) => (
          <Checkbox
            key={term.id}
            checked={agreed.includes(term.id)}
            onChange={() => toggle(term.id)}
          >
            {term.label}
          </Checkbox>
        ))}
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const all = () => canvas.getByRole("checkbox", { name: "전체 동의" });
    await step("하나만 고르면 전체 동의는 일부 선택(mixed)", async () => {
      await userEvent.click(canvas.getByText("마케팅 정보 받기"));
      await expect(all()).toHaveProperty("indeterminate", true);
      await expect(all()).not.toBeChecked();
    });
    await step("전체 동의를 누르면 모두 선택", async () => {
      await userEvent.click(canvas.getByText("전체 동의"));
      await expect(all()).toBeChecked();
      await expect(all()).toHaveProperty("indeterminate", false);
      for (const term of terms) {
        await expect(canvas.getByRole("checkbox", { name: term.label })).toBeChecked();
      }
    });
    await step("다시 누르면 모두 해제", async () => {
      await userEvent.click(canvas.getByText("전체 동의"));
      for (const term of terms) {
        await expect(canvas.getByRole("checkbox", { name: term.label })).not.toBeChecked();
      }
    });
  },
};

// 폼 제출: name·value가 그대로 넘어간다
export const InForm: Story = {
  render: function Render() {
    const [sent, setSent] = useState("");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(new FormData(event.currentTarget).getAll("interest").join(","));
        }}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        <Checkbox name="interest" value="btc" defaultChecked>
          비트코인
        </Checkbox>
        <Checkbox name="interest" value="eth">
          이더리움
        </Checkbox>
        <button type="submit">제출</button>
        <output>{sent}</output>
      </form>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("이더리움"));
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("btc,eth");
  },
};

// Figma Size: XSmall 16 · Small 20(기본) · Medium 24 · Large 32. 상자·높이를 확인한다
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gap: 8,
        alignItems: "center",
      }}
    >
      {(["xs", "sm", "md", "lg"] as const).map((size) => [
        <Checkbox key={size} {...args} size={size}>
          {size}
        </Checkbox>,
        <Checkbox key={`${size}-c`} {...args} size={size} defaultChecked>
          {`${size} 체크`}
        </Checkbox>,
        <Checkbox key={`${size}-i`} {...args} size={size} indeterminate tight>
          {`${size} 일부`}
        </Checkbox>,
      ])}
    </div>
  ),
  play: async ({ canvas }) => {
    const label = (name: string) => canvas.getByRole("checkbox", { name }).closest("label")!;
    const box = (name: string) =>
      Math.round(label(name).querySelector("[aria-hidden=true]")!.getBoundingClientRect().width);
    const height = (name: string) => Math.round(label(name).getBoundingClientRect().height);
    await expect([box("xs"), box("sm"), box("md"), box("lg")]).toEqual([16, 20, 24, 32]);
    await expect([height("xs"), height("sm"), height("md"), height("lg")]).toEqual([
      40, 40, 40, 48,
    ]);
    const check = (name: string) =>
      Math.round(label(name).querySelector("svg")!.getBoundingClientRect().width);
    await expect([check("xs 체크"), check("sm 체크"), check("md 체크"), check("lg 체크")]).toEqual([
      12, 16, 20, 26,
    ]);
    await expect([height("sm 일부"), height("md 일부"), height("lg 일부")]).toEqual([24, 28, 32]);
  },
};

// 구간별 값: 모바일 md → 데스크톱(1024px~) sm
export const Responsive: Story = {
  args: { size: { base: "md", desktop: "sm" }, children: "약관 동의" },
  play: async ({ canvas }) => {
    const mark = canvas.getByRole("checkbox").closest("label")!.querySelector("[aria-hidden=true]");
    await expect(mark).toHaveClass("size-6", "desktop:size-5");
  },
};
