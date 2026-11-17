import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, Text, TextField, useDebounceValue } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useDebounceValue",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 입력은 바로 보이고, 요청에 쓸 값은 300ms 멈춘 뒤에 확정된다. 기다리는 동안 isDebouncing
export const Search: Story = {
  render: function Render() {
    const [query, setQuery] = useState("");
    const { debouncedValue, isDebouncing, flush, cancel } = useDebounceValue(query, 300);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
        <TextField
          value={query}
          aria-label="코인 검색"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && flush()}
        />
        <Text variant="body-3-regular" color="secondary">
          요청 값: {debouncedValue || "(없음)"}
        </Text>
        <Text variant="caption-1-regular" color="tertiary">
          {isDebouncing ? "입력 중…" : "확정됨"}
        </Text>
        <Button variant="outline" size="sm" onClick={cancel}>
          취소
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "코인 검색" });
    await step("처음에는 확정 상태", async () => {
      await expect(canvas.getByText("확정됨")).toBeInTheDocument();
    });
    await step("입력하는 동안에는 이전 값 + isDebouncing", async () => {
      await userEvent.type(input, "btc", { delay: 50 });
      await expect(canvas.getByText("요청 값: (없음)")).toBeInTheDocument();
      await expect(canvas.getByText("입력 중…")).toBeInTheDocument();
    });
    await step("멈추면 300ms 뒤 확정", async () => {
      await waitFor(() => expect(canvas.getByText("요청 값: btc")).toBeInTheDocument());
      await expect(canvas.getByText("확정됨")).toBeInTheDocument();
    });
    await step("Enter(flush)는 기다리지 않고 바로 확정", async () => {
      await userEvent.type(input, "x{Enter}");
      await expect(canvas.getByText("요청 값: btcx")).toBeInTheDocument();
      await expect(canvas.getByText("확정됨")).toBeInTheDocument();
    });
    await step("cancel은 기다리던 값을 버리고 이전 값을 유지", async () => {
      await userEvent.type(input, "y");
      await expect(canvas.getByText("입력 중…")).toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "취소" }));
      await expect(canvas.getByText("확정됨")).toBeInTheDocument();
      await new Promise((resolve) => setTimeout(resolve, 400));
      await expect(canvas.getByText("요청 값: btcx")).toBeInTheDocument();
    });
  },
};
