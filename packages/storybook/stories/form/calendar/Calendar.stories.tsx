import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Box, Calendar, Text } from "@futurewiz-rms/mint";

const TODAY = "2026-11-11";
const marks = {
  "2026-11-03": [{ color: "brand" as const, label: "결제일" }],
  "2026-11-12": [{ color: "brand" as const }],
  "2026-11-20": [
    { color: "brand" as const },
    { color: "danger" as const },
    { color: "success" as const },
  ],
  "2026-11-27": [{ color: "neutral" as const }],
};

const meta = {
  title: "Components/Form/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { today: TODAY, onChange: fn(), onMonthChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    weekStartsOn: { control: "inline-radio", options: [0, 1] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 일정 점(최대 3개) + 공휴일
export const WithMarks: Story = {
  args: {
    defaultValue: "2026-11-12",
    marks,
    holidays: { "2026-11-17": "임시 공휴일" },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /11월 20일.*일정 3개/ })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /11월 3일.*결제일/ })).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: /11월 17일.*임시 공휴일/ }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /11월 11일.*오늘/ })).toHaveAttribute(
      "aria-current",
      "date",
    );
  },
};

// 고를 수 있는 범위(min·max)와 막힌 날
export const MinMax: Story = {
  args: { disabledDates: ["2026-11-15"], min: "2026-11-05", max: "2026-11-25" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /11월 4일/ })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: /11월 15일/ })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "이전 달" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "다음 달" })).toBeDisabled();
  },
};

export const WeekStartsMonday: Story = {
  args: { weekStartsOn: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("columnheader")[0]).toHaveTextContent("월");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Box gap={24}>
      <Calendar {...args} size="md" marks={marks} />
      <Calendar {...args} size="lg" marks={marks} />
    </Box>
  ),
};

// 선택·달 이동·키보드 테스트
export const Interaction: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    const [month, setMonth] = useState("2026-11");
    return (
      <Box gap={8}>
        <Calendar
          {...args}
          value={value}
          month={month}
          onChange={setValue}
          onMonthChange={setMonth}
        />
        <Text variant="body-3-regular" color="secondary">
          선택: {value ?? "없음"} · 달: {month}
        </Text>
      </Box>
    );
  },
  play: async ({ canvas, step }) => {
    await step("오늘 칸만 Tab으로 들어옴", async () => {
      await expect(canvas.getByRole("button", { name: /11월 11일/ })).toHaveAttribute(
        "tabindex",
        "0",
      );
      await expect(canvas.getByRole("button", { name: /11월 12일/ })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });
    await step("누르면 선택", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /11월 20일/ }));
      await expect(canvas.getByText("선택: 2026-11-20 · 달: 2026-11")).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: /11월 20일/ }).closest("[role=gridcell]"),
      ).toHaveAttribute("aria-selected", "true");
    });
    await step("→↓는 하루·한 주, 달을 넘으면 달도 바뀜", async () => {
      canvas.getByRole("button", { name: /11월 20일/ }).focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(canvas.getByRole("button", { name: /11월 21일/ })).toHaveFocus();
      await userEvent.keyboard("{ArrowDown}{ArrowDown}");
      await expect(canvas.getByText(/달: 2026-12/)).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: /12월 5일/ })).toHaveFocus();
    });
    await step("PageUp은 이전 달 같은 날, Enter로 선택", async () => {
      await userEvent.keyboard("{PageUp}");
      await expect(canvas.getByRole("button", { name: /11월 5일/ })).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await expect(canvas.getByText("선택: 2026-11-05 · 달: 2026-11")).toBeInTheDocument();
    });
    await step("다음 달 버튼", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "다음 달" }));
      await expect(canvas.getByText("2026년 12월")).toBeInTheDocument();
    });
  },
};

// 기본 md(행 48), 넓게 배치하는 데스크톱(1024px~)에서 lg(행 56)
export const Responsive: Story = {
  args: { size: { base: "md", desktop: "lg" }, marks },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("gridcell")[0]).toHaveClass("h-12", "desktop:h-14");
  },
};

export const Mobile: Story = {
  args: { size: "md", marks },
  globals: { viewport: { value: "mobile" } },
};

// 화면 폭이 아닌 실제 부모 너비를 검증한다(문서의 중첩 여백·DatePicker 팝오버 포함).
export const NarrowContainers: Story = {
  render: (args) => (
    <Box gap={24}>
      {([216, 248, 280] as const).map((width) => (
        <div key={width} style={{ width, maxWidth: "100%" }}>
          <Text variant="body-3-regular">부모 폭 {width}px · md / lg</Text>
          <Box gap={16}>
            <Calendar {...args} size="md" marks={marks} />
            <Calendar {...args} size="lg" marks={marks} />
          </Box>
        </div>
      ))}
    </Box>
  ),
  play: async ({ canvas, args }) => {
    for (const grid of canvas.getAllByRole("grid")) {
      const bounds = grid.getBoundingClientRect();
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
      const dates = within(grid).getAllByRole("button");
      for (const date of dates) {
        const buttonBounds = date.getBoundingClientRect();
        const cellBounds = date.parentElement!.getBoundingClientRect();
        const circleBounds = date.firstElementChild!.getBoundingClientRect();
        await expect(buttonBounds.width).toBeCloseTo(cellBounds.width, 0);
        await expect(buttonBounds.height).toBe(cellBounds.height);
        await expect(buttonBounds.left).toBeGreaterThanOrEqual(bounds.left - 1);
        await expect(buttonBounds.right).toBeLessThanOrEqual(bounds.right + 1);
        await expect(circleBounds.width).toBeLessThanOrEqual(buttonBounds.width + 1);
        await expect(circleBounds.height).toBeCloseTo(circleBounds.width, 0);
      }
    }
    const date = canvas.getAllByRole("button", { name: /11월 20일/ })[0];
    const bounds = date.getBoundingClientRect();
    // 숫자 원 바깥의 셀 아래 모서리도 날짜를 선택한다.
    await userEvent.pointer({
      target: date,
      keys: "[MouseLeft]",
      coords: { clientX: bounds.left + 2, clientY: bounds.bottom - 2 },
    });
    await expect(args.onChange).toHaveBeenCalledWith("2026-11-20");
  },
  parameters: { docs: { source: { code: '<Calendar today="2026-11-11" />' } } },
};
