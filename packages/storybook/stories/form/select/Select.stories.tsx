import { useState, type ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  Box,
  Button,
  GlobeIcon,
  Select as SelectComponent,
  type SelectOption,
} from "@futurewiz-rms/mint";

// Select의 props는 `multiple`에 따라 값 타입이 갈리는 유니온이라 Meta가 `never`로 좁혀진다. 스토리에서는 느슨한 타입으로 받는다
const Select = SelectComponent as unknown as ComponentType<Record<string, unknown>>;

const markets: SelectOption[] = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH" },
  { value: "xrp", label: "XRP" },
  { value: "sol", label: "SOL" },
];

const meta = {
  title: "Components/Form/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "라벨",
    helper: "도움말 메시지",
    options: markets,
    onChange: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    helper: { control: "text" },
    helpIcon: { control: "boolean" },
    status: { control: "inline-radio", options: ["normal", "negative", "positive"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
    labelPosition: { control: "inline-radio", options: ["top", "left"] },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Large 48 · Medium 40 · Small 32. 목록 항목도 같은 크기를 따른다
export const Sizes: Story = {
  render: () => (
    <Box gap={16}>
      <Select label="Large" size="lg" options={markets} defaultValue="krw" />
      <Select label="Medium" size="md" options={markets} defaultValue="krw" />
      <Select label="Small" size="sm" options={markets} defaultValue="krw" />
    </Box>
  ),
};

// 열린 모양. 고른 항목은 브랜드 색과 오른쪽 체크로 보인다
export const Open: Story = {
  args: { defaultValue: "btc", open: true },
};

export const Multiple: Story = {
  args: { defaultValue: ["krw", "usdt"], open: true, multiple: true },
};

export const LabelLeft: Story = {
  args: { defaultValue: "krw", labelPosition: "left" },
};

// 상태: 오류(negative) · 확인 완료(positive) · 필수 · 비활성 · 읽기 전용
export const States: Story = {
  render: () => (
    <Box gap={16}>
      <Select label="오류" status="negative" helper="시장을 골라 주세요" options={markets} />
      <Select
        label="확인 완료"
        status="positive"
        defaultValue="krw"
        helper="사용할 수 있어요"
        options={markets}
      />
      <Select label="필수" required options={markets} />
      <Select label="비활성" disabled defaultValue="btc" options={markets} />
      <Select label="읽기 전용" readOnly defaultValue="btc" options={markets} />
    </Box>
  ),
};

export const LeadingIcon: Story = {
  args: { leadingIcon: <GlobeIcon />, defaultValue: "krw" },
};

// 항목에 설명·앞 요소를 붙이고, 그룹으로 나눈다(그룹 사이에는 가로선)
export const DescriptionAndGroups: Story = {
  args: {
    options: [
      {
        group: "법정화폐",
        options: [{ value: "krw", label: "원화", description: "원화로 거래해요" }],
      },
      {
        group: "코인",
        options: [
          { value: "btc", label: "BTC", description: "비트코인", leadingIcon: <GlobeIcon /> },
          { value: "eth", label: "ETH", disabled: true },
        ],
      },
    ],
    defaultValue: "krw",
    open: true,
  },
};

// 고른 값을 칸 아래 칩으로. 칩 크기는 Select의 size를 따른다(lg → Chip lg 40 · md → 32 · sm → 28)
export const Chips: Story = {
  render: () => (
    <Box gap={24}>
      {(["lg", "md", "sm"] as const).map((size) => (
        <Select
          key={size}
          label={size}
          size={size}
          multiple
          render="chip"
          defaultValue={["krw", "btc", "usdt", "eth", "xrp"]}
          options={markets}
        />
      ))}
    </Box>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(["krw"]);
    return (
      <Select
        label="시장"
        multiple
        render="chip"
        value={selected}
        onChange={setSelected}
        helper={`${selected.length}개 선택`}
        options={markets}
      />
    );
  },
};

// 구간별 값: 모바일·태블릿은 라벨 위·칸 48, 데스크톱(1024px~)부터 라벨 왼쪽·칸 40. 툴바 뷰포트(360 · 768 · 1024 · 1440)로 확인한다
export const Responsive: Story = {
  args: {
    size: { base: "lg", desktop: "md" },
    defaultValue: "krw",
    labelPosition: { base: "top", desktop: "left" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "padded" },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  args: { defaultValue: "krw" },
};

// 칸을 누르면 열리고, 항목을 고르면 값이 바뀌며 닫힌다. 방향키·Enter·Esc로도 된다
export const OpenSelectAndKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", { name: /라벨/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(canvas.getByRole("option", { name: "BTC" }));
    await expect(args.onChange).toHaveBeenCalledWith("btc");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{ArrowDown}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith("usdt");
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

// 여러 개 고르기: 고른 뒤에도 열려 있고, 다시 누르면 해제된다. 칩의 ×로도 지운다
export const MultipleSelectAndRemove: Story = {
  args: { defaultValue: ["krw"], multiple: true, render: "chip" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.click(canvas.getByRole("option", { name: "BTC" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(["krw", "btc"]);
    await expect(canvas.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(canvas.getByRole("button", { name: "원화 삭제" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(["btc"]);
  },
};

// 폼 제출: 일반·읽기 전용은 값이 제출되고, 비활성은 제출되지 않는다(네이티브 disabled 입력과 같음)
export const InForm: Story = {
  render: function Render() {
    const [sent, setSent] = useState("");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSent(
            ["normal", "readonly", "disabled"]
              .map((name) => `${name}=${data.get(name) ?? "-"}`)
              .join(" "),
          );
        }}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <Select label="일반" name="normal" defaultValue="btc" options={markets} />
        <Select label="읽기 전용" name="readonly" readOnly defaultValue="btc" options={markets} />
        <Select label="비활성" name="disabled" disabled defaultValue="btc" options={markets} />
        <Button size="sm" type="submit">
          제출
        </Button>
        <output>{sent}</output>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "normal=btc readonly=btc disabled=-",
    );
  },
};

export const DisabledNotOpenable: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"), { pointerEventsCheck: 0 });
    await expect(canvas.queryByRole("listbox")).toBeNull();
  },
};
