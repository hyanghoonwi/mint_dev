import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const display = ["semibold", "bold"];
const heading = ["medium", "semibold", "bold"];
const body = ["regular", "medium", "semibold", "bold"];
const caption = ["regular", "medium", "semibold"];

// [이름, 크기/줄 간격, 허용 웨이트, 보기 문장]
const styles = [
  ["display-1", "52 / 68", display, "가장 큰 문구 Aa 123"],
  ["display-2", "40 / 52", display, "가장 큰 문구 Aa 123"],
  ["display-3", "36 / 48", display, "가장 큰 문구 Aa 123"],
  ["title-1", "32 / 44", heading, "타이틀 Aa 123"],
  ["title-2", "28 / 38", heading, "타이틀 Aa 123"],
  ["title-3", "24 / 34", heading, "타이틀 Aa 123"],
  ["heading-1", "22 / 32", heading, "섹션 제목을 입력하세요 Aa 123"],
  ["heading-2", "20 / 30", heading, "섹션 제목을 입력하세요 Aa 123"],
  ["heading-3", "18 / 26", heading, "섹션 제목을 입력하세요 Aa 123"],
  ["body-1", "17 / 28", body, "기본 본문입니다. The quick brown fox 0123456789"],
  ["body-2", "16 / 24", body, "기본 본문입니다. The quick brown fox 0123456789"],
  ["body-3", "15 / 22", body, "기본 본문입니다. The quick brown fox 0123456789"],
  ["body-4", "14 / 22", body, "기본 본문입니다. The quick brown fox 0123456789"],
  ["body-5", "13 / 20", body, "기본 본문입니다. The quick brown fox 0123456789"],
  ["label-1", "16 / 20", heading, "버튼 라벨 Label 123"],
  ["label-2", "14 / 20", heading, "버튼 라벨 Label 123"],
  ["label-3", "12 / 16", heading, "버튼 라벨 Label 123"],
  ["caption-1", "12 / 18", caption, "날짜 · 도움말 Caption 123"],
  ["caption-2", "11 / 16", caption, "날짜 · 도움말 Caption 123"],
] as const;

// Figma "Typography"와 같은 19개 역할 × 허용 웨이트 = 59개 스타일. 글자 크기는 화면 폭에 따라 바뀌지 않는다
export const AllStyles: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {styles.map(([name, metrics, weights, sample]) => (
        <section key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <code className="text-caption-1-medium text-text-secondary">
            {name} · {metrics}px
          </code>
          {weights.map((weight) => (
            <div key={weight} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span className="text-caption-1-regular text-text-caption" style={{ width: 72 }}>
                {weight}
              </span>
              <span className={`text-${name}-${weight}`}>{sample}</span>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
  // 코드 패널에는 갤러리를 그리는 코드가 아니라, 사용하는 쪽이 쓰는 코드를 보여 준다
  parameters: {
    docs: {
      source: {
        code: `<h2 className="text-title-2-bold">오늘의 시세</h2>
<p className="text-body-2-regular">기본 본문입니다.</p>`,
      },
    },
  },
};
