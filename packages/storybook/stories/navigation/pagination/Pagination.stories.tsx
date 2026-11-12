import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Pagination } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { page: 6, total: 99, onChange: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["extended", "compact"] },
    page: { control: { type: "number", min: 1 } },
    total: { control: { type: "number", min: 1 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 칸의 글자를 순서대로(화살표 칸은 "↔") */
const slotText = (root: HTMLElement) =>
  [...(root.querySelector("ul") as HTMLElement).querySelectorAll("li")]
    .map((listItem) => listItem.textContent?.trim() || "↔")
    .join(" ");

export const Extended: Story = {
  args: { variant: "extended" },
  play: async ({ canvasElement }) => {
    await expect(slotText(canvasElement)).toBe("↔ 1 … 5 6 7 … 99 ↔");
  },
};

export const Compact: Story = {
  args: { variant: "compact" },
  play: async ({ canvasElement }) => {
    await expect(slotText(canvasElement)).toBe("↔ 1 … 6 … 99 ↔");
  },
};

// 기본값: 모바일 compact, 태블릿(768px~)부터 extended. 목록 두 개를 CSS로 하나만 보인다
export const DefaultVariant: Story = {
  play: async ({ canvasElement }) => {
    const lists = canvasElement.querySelectorAll("ul");
    await expect(lists).toHaveLength(2);
    await expect(lists[0]).toHaveClass("flex", "tablet:hidden");
    await expect(lists[1]).toHaveClass("hidden", "tablet:flex");
  },
};

// 구간별 값: 데스크톱(1024px~)에서만 extended
export const Responsive: Story = {
  args: { variant: { base: "compact", desktop: "extended" } },
  play: async ({ canvasElement }) => {
    const lists = canvasElement.querySelectorAll("ul");
    await expect(lists[0]).toHaveClass("flex", "desktop:hidden");
    await expect(lists[1]).toHaveClass("hidden", "desktop:flex");
  },
};

// 값 하나면 목록도 하나
export const SingleVariant: Story = {
  args: { variant: "compact" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("ul")).toHaveLength(1);
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
};

// 처음·끝에서는 이전·다음이 비활성
export const Edges: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Pagination {...args} variant="extended" page={1} />
      <Pagination {...args} variant="extended" page={99} />
      <Pagination {...args} variant="extended" page={3} total={7} />
    </div>
  ),
};

// 버튼: 누르면 페이지가 바뀌고 aria-current가 옮겨진다
export const Interaction: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    return <Pagination variant="extended" page={page} total={20} onChange={setPage} />;
  },
  play: async ({ canvas, step }) => {
    const navigation = within(canvas.getByRole("navigation", { name: "페이지" }));
    await step("처음: 이전 비활성, 1페이지가 현재", async () => {
      await expect(navigation.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
      await expect(navigation.getByRole("button", { name: "1페이지" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
    await step("다음을 누르면 2페이지", async () => {
      await userEvent.click(navigation.getByRole("button", { name: "다음 페이지" }));
      await expect(navigation.getByRole("button", { name: "2페이지" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
    await step("끝 번호를 누르면 다음이 비활성", async () => {
      await userEvent.click(navigation.getByRole("button", { name: "20페이지" }));
      await expect(navigation.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
      await expect(navigation.getByRole("button", { name: "19페이지" })).toBeInTheDocument();
    });
  },
};

// 링크: 주소로 이동(서버 컴포넌트에서 쓰는 방식)
export const Links: Story = {
  args: {
    variant: "extended",
    getHref: (pageNumber: number) => `?page=${pageNumber}`,
    onChange: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "7페이지" })).toHaveAttribute("href", "?page=7");
    await expect(canvas.getByRole("link", { name: "6페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

// 1페이지뿐이면 그리지 않는다
export const SinglePage: Story = {
  args: { total: 1, page: 1 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("nav")).toBeNull();
  },
};
