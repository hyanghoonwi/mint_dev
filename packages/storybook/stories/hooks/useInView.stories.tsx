import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { SkeletonText, Text, useInView } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useInView",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 스크롤 상자 안에서 아래 칸이 보이는지
export const Basic: Story = {
  render: function Render() {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const { ref, inView } = useInView({ root });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
        <Text variant="label-2-semibold">{inView ? "보여요" : "안 보여요"}</Text>
        <div
          ref={setRoot}
          data-testid="box"
          style={{ height: 160, overflow: "auto", border: "1px solid var(--mint-border-default)" }}
        >
          <div style={{ height: 400 }} />
          <div ref={ref} className="bg-fill-brand-weak p-4">
            <Text variant="label-2-medium">관찰하는 칸</Text>
          </div>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("처음에는 안 보임", async () => {
      await waitFor(() => expect(canvas.getByText("안 보여요")).toBeInTheDocument());
    });
    await step("끝까지 스크롤하면 보임", async () => {
      const box = canvas.getByTestId("box");
      box.scrollTop = box.scrollHeight;
      await waitFor(() => expect(canvas.getByText("보여요")).toBeInTheDocument());
    });
  },
};

// 무한 스크롤: 끝의 빈 칸이 보이면 다음 묶음을 더한다
export const InfiniteScroll: Story = {
  render: function Render() {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const [count, setCount] = useState(10);
    const done = count >= 30;
    const { ref, inView } = useInView({ root, rootMargin: "0px 0px 80px 0px", skip: done });
    // 끝 칸이 보이는 동안 계속 채운다(불러온 뒤에도 여전히 보이면 한 번 더)
    useEffect(() => {
      if (inView && !done) setCount((c) => Math.min(c + 10, 30));
    }, [inView, done, count]);
    return (
      <div ref={setRoot} data-testid="list" style={{ height: 240, width: 280, overflow: "auto" }}>
        {Array.from({ length: count }, (_, i) => (
          <Text key={i} as="p" variant="body-3-regular" className="px-4 py-3">
            코인 {i + 1}
          </Text>
        ))}
        {!done && (
          <div ref={ref} className="p-4">
            <SkeletonText />
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    for (const last of [20, 30]) {
      list.scrollTop = list.scrollHeight;
      await waitFor(() => expect(canvas.getByText(`코인 ${last}`)).toBeInTheDocument());
    }
  },
};

// triggerOnce: 한 번 보이면 계속 true
export const TriggerOnce: Story = {
  render: function Render() {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const { ref, inView } = useInView({ root, triggerOnce: true });
    return (
      <div ref={setRoot} data-testid="box" style={{ height: 160, width: 280, overflow: "auto" }}>
        <div style={{ height: 400 }} />
        <div ref={ref} className="p-4">
          <Text variant="label-2-medium">{inView ? "한 번 보였어요" : "아직이에요"}</Text>
        </div>
        <div style={{ height: 400 }} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByTestId("box");
    box.scrollTop = 300;
    await waitFor(() => expect(canvas.getByText("한 번 보였어요")).toBeInTheDocument());
    box.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(canvas.getByText("한 번 보였어요")).toBeInTheDocument();
  },
};
