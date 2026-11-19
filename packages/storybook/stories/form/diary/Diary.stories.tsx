import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Diary } from "@futurewiz-rms/mint";

// 코인 로고 대신 쓰는 동그란 이미지(SVG 데이터 주소)
const coinImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%23627eea'/%3E%3C/svg%3E";
const TODAY = "2026-11-18";
const events = {
  "2026-11-15": [{ label: "언락" }, { label: "메인넷" }],
  "2026-11-18": [
    { label: "언락" },
    { label: "메인넷" },
    { label: "상장" },
    { label: "에어드랍" },
    { label: "점검" },
  ],
  "2026-11-19": [{ label: "언락" }],
  "2026-11-20": [{ label: "언락" }, { label: "메인넷" }, { label: "상장" }],
};

const meta = {
  title: "Components/Form/Diary",
  component: Diary,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { today: TODAY, events, onChange: fn() },
  argTypes: {
    maxEvents: { control: { type: "number", min: 0, max: 5 } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Diary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: /11월 19일/ }));
    await expect(args.onChange).toHaveBeenCalledWith("2026-11-19");
    await expect(canvas.getByRole("button", { name: /11월 19일/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

// 오늘은 요일 글자가 "오늘"이고 파랑 윗줄
export const Today: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /11월 18일.*오늘/ })).toHaveAttribute(
      "aria-current",
      "date",
    );
  },
};

// 일요일은 자동으로 빨강, 공휴일은 holidays로 넘긴다
export const Holidays: Story = {
  args: { holidays: { "2026-11-17": "임시 공휴일" } },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /11월 17일.*임시 공휴일/ }),
    ).toBeInTheDocument();
  },
};

export const Selected: Story = {
  args: { defaultValue: "2026-11-20" },
};

// 지난 날은 50% 흐려지고 누를 수 없다
export const DisablePast: Story = {
  args: { min: TODAY },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /11월 16일/ })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: /11월 18일/ })).toBeEnabled();
  },
};

// 일정이 maxEvents(기본 2)를 넘으면 +N
export const MoreEvents: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /11월 18일.*일정 5개/ })).toBeInTheDocument();
  },
};

// 일정에 image를 주면 문구 앞에 16px 동그란 이미지가 붙는다
export const WithImage: Story = {
  args: {
    events: {
      "2026-11-17": [{ label: "ARB 언락", image: coinImage }],
      "2026-11-18": [{ label: "ARB 언락", image: coinImage }, { label: "점검" }],
    },
  },
};

// 보여 주는 기간은 오늘 3일 전(11-15)부터 오늘 2개월 뒤(2027-01-18)까지 고정이다
export const Range: Story = {
  play: async ({ canvasElement }) => {
    const cell = (date: string) => canvasElement.querySelector(`[data-date="${date}"]`);
    await expect(cell("2026-11-14")).toBeNull();
    await expect(cell("2026-11-15")).not.toBeNull();
    await expect(cell("2027-01-18")).not.toBeNull();
    await expect(cell("2027-01-19")).toBeNull();
  },
};

// 칸 일곱 개(672px)보다 좁으면 가로로 넘기고, 넘친 쪽 가장자리가 흐려진다
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { value: "mobile" } },
};
