import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import sample from "./avatar-sample.jpg";
import { Box, Button, Menu, MenuDivider, MenuGroup, MenuItem } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Navigation/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: (
      <>
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
        <MenuItem value="volume">거래량순</MenuItem>
      </>
    ),
    defaultValue: "latest",
    "aria-label": "정렬",
    onChange: fn(),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["normal", "radio", "checkbox"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    cellPadding: { control: "inline-radio", options: [8, 12] },
    maxHeight: { control: "number" },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Normal은 고른 항목에 체크 표시, Radio는 하나만, Checkbox는 여러 개를 고른다
export const Variants: Story = {
  render: () => (
    <Box direction="horizontal" align="start" gap={24}>
      <Menu defaultValue="latest" aria-label="정렬">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
      <Menu variant="radio" defaultValue="week" aria-label="기간">
        <MenuItem value="day">1일</MenuItem>
        <MenuItem value="week">1주</MenuItem>
        <MenuItem value="month">1개월</MenuItem>
      </Menu>
      <Menu variant="checkbox" defaultValue={["krw", "usdt"]} aria-label="시장">
        <MenuItem value="krw">원화</MenuItem>
        <MenuItem value="btc">BTC</MenuItem>
        <MenuItem value="usdt">USDT</MenuItem>
      </Menu>
    </Box>
  ),
};

// Small 36 · 200 / Medium 44 · 240 / Large 52 · 280
export const Sizes: Story = {
  render: () => (
    <Box direction="horizontal" align="start" gap={24}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Menu key={size} size={size} defaultValue="latest" aria-label={`정렬 ${size}`}>
          <MenuItem value="latest">최신순</MenuItem>
          <MenuItem value="popular">인기순</MenuItem>
          <MenuItem value="price">가격순</MenuItem>
        </Menu>
      ))}
    </Box>
  ),
};

// 촘촘한 목록은 8, 일반 목록은 12
export const CellPadding: Story = {
  render: () => (
    <Box direction="horizontal" align="start" gap={24}>
      {([8, 12] as const).map((cellPadding) => (
        <Menu
          key={cellPadding}
          defaultValue="latest"
          cellPadding={cellPadding}
          aria-label={`정렬 ${cellPadding}`}
        >
          <MenuItem value="latest">최신순</MenuItem>
          <MenuItem value="popular">인기순</MenuItem>
          <MenuItem value="price">가격순</MenuItem>
        </Menu>
      ))}
    </Box>
  ),
};

export const Groups: Story = {
  render: () => (
    <Menu defaultValue="latest" aria-label="코인 정렬과 보기">
      <MenuGroup label="정렬">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
      </MenuGroup>
      <MenuDivider />
      <MenuGroup label="보기">
        <MenuItem value="list">목록</MenuItem>
        <MenuItem value="grid">격자</MenuItem>
      </MenuGroup>
    </Menu>
  ),
};

// 앞에 24px 동그란 이미지. Radio·Checkbox와도 함께 쓴다
export const WithImage: Story = {
  render: () => (
    <Box direction="horizontal" align="start" gap={24}>
      <Menu defaultValue="main" aria-label="계정">
        <MenuItem leadingImage={sample} value="main">
          메인 계정
        </MenuItem>
        <MenuItem leadingImage={sample} value="sub">
          보조 계정
        </MenuItem>
      </Menu>
      <Menu variant="checkbox" defaultValue={["main"]} aria-label="계정 여러 개">
        <MenuItem leadingImage={sample} value="main">
          메인 계정
        </MenuItem>
        <MenuItem leadingImage={sample} value="sub">
          보조 계정
        </MenuItem>
      </Menu>
    </Box>
  ),
};

// 아래 액션 영역: 선택을 적용하거나 초기화하는 버튼
export const ActionArea: Story = {
  render: function Render() {
    const [markets, setMarkets] = useState<string[]>(["krw"]);
    return (
      <Menu
        variant="checkbox"
        actionArea={
          <>
            <Button variant="ghost" color="neutral" size="sm" onClick={() => setMarkets([])}>
              초기화
            </Button>
            <Button size="sm">적용</Button>
          </>
        }
        value={markets}
        aria-label="시장"
        onChange={setMarkets}
      >
        <MenuItem value="krw">원화</MenuItem>
        <MenuItem value="btc">BTC</MenuItem>
        <MenuItem value="usdt">USDT</MenuItem>
      </Menu>
    );
  },
};

// 항목이 넘치면 최대 높이에서 스크롤된다
export const ScrollBar: Story = {
  render: () => (
    <Menu variant="radio" defaultValue="btc" maxHeight={176} aria-label="코인">
      {["BTC", "ETH", "XRP", "SOL", "DOGE", "ADA", "AVAX", "DOT"].map((coin) => (
        <MenuItem key={coin} value={coin.toLowerCase()}>
          {coin}
        </MenuItem>
      ))}
    </Menu>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Menu defaultValue="latest" aria-label="정렬">
      <MenuItem value="latest">최신순</MenuItem>
      <MenuItem value="popular" disabled>
        인기순(준비 중)
      </MenuItem>
      <MenuItem value="price">가격순</MenuItem>
    </Menu>
  ),
};

// 값이 없는 항목은 고르지 않고 누르는 동작만 한다(복사·삭제 같은 액션)
export const Actions: Story = {
  render: () => (
    <Menu aria-label="코인 작업">
      <MenuItem onClick={fn()}>복사</MenuItem>
      <MenuItem onClick={fn()}>공유</MenuItem>
      <MenuDivider />
      <MenuItem onClick={fn()}>삭제</MenuItem>
    </Menu>
  ),
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  render: () => (
    <Menu size="lg" defaultValue="latest" aria-label="정렬" className="w-full">
      <MenuItem value="latest">최신순</MenuItem>
      <MenuItem value="popular">인기순</MenuItem>
      <MenuItem value="price">가격순</MenuItem>
    </Menu>
  ),
};

// 항목을 누르면 선택이 바뀌고 onChange가 새 값으로 호출된다. 방향키로 항목 사이를 옮긴다
export const SelectAndKeyboard: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("menuitem", { name: "최신순" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await userEvent.click(canvas.getByRole("menuitem", { name: "인기순" }));
    await expect(args.onChange).toHaveBeenCalledWith("popular");
    await expect(canvas.getByRole("menuitem", { name: "인기순" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: "가격순" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("menuitem", { name: "거래량순" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: "최신순" })).toHaveFocus();
  },
};

// Checkbox는 여러 개를 고르고, 다시 누르면 해제된다
export const CheckboxToggle: Story = {
  args: { variant: "checkbox", defaultValue: ["latest"] },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("menuitemcheckbox", { name: "인기순" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(["latest", "popular"]);
    await userEvent.click(canvas.getByRole("menuitemcheckbox", { name: "최신순" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(["popular"]);
  },
};
