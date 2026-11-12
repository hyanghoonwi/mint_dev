# 레이아웃

> 색인: [`../AGENTS.md`](../AGENTS.md)

페이지를 짤 때 `div`에 그리드 클래스를 직접 쓰지 않고 `Container`와 `Grid`로 감쌉니다. 둘 다 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). 컬럼 수(모바일 4 · 태블릿 8 · 데스크톱 12), 거터·여백(20px), 콘텐츠 최대 폭(1440px)은 구간에 맞게 알아서 바뀝니다.

```tsx
import { Container, Grid } from "@futurewiz-rms/mint";

<Container>
  <Grid>
    {cards.map((card) => (
      <Grid.Item key={card.id} span={{ base: 4, tablet: 4, desktop: 3 }}>
        <CardView card={card} />
      </Grid.Item>
    ))}
  </Grid>
</Container>;
```

- **`Container`** — 페이지 틀. 화면 좌우 여백(20px)을 두고 콘텐츠를 최대 1440px로 가운데에 고정합니다. 모바일·태블릿은 화면을 가득 채우고, 1440px보다 넓으면 바깥 여백만 늘어납니다. 나머지 `<div>` 속성을 받습니다.
- **`Grid`** — 컬럼 그리드. 안에 `Grid.Item`을 놓습니다. 컬럼 수와 거터는 구간에 따라 자동이라 prop이 없습니다. 나머지 `<div>` 속성을 받습니다.
- **`Grid.Item`** — 그리드의 칸. `span`으로 구간별 차지할 컬럼 수를 정합니다.
  - `span={{ base, tablet?, desktop? }}`: `base` 1~4(모바일 4컬럼), `tablet` 1~8(8컬럼), `desktop` 1~12(12컬럼). 생략한 구간은 앞 구간 값을 따릅니다(`tablet` 생략 → `base`, `desktop` 생략 → `tablet`).
  - `span` 자체를 생략하면 한 줄을 모두 차지합니다.
  - 한 줄에 N개: 컬럼 수 ÷ N을 `span`으로 줍니다. 모바일 1개/줄 · 태블릿 2개/줄 · 데스크톱 4개/줄 → `{ base: 4, tablet: 4, desktop: 3 }`.
- **`Divider`** — 내용을 시각적으로 나누는 선(Figma `Divider`). 서버 컴포넌트에서도 쓸 수 있습니다. 표시 전용이고 보조기기에서 읽지 않습니다(`aria-hidden`). 상세 규칙은 `components/divider/AGENTS.md`
  - `orientation`: `horizontal`(기본, 부모 폭을 채움) · `vertical`(flex 줄 안에서 높이를 채움, flex 밖이면 `className`으로 `h-*`)
  - `variant`: `default`(기본, `border-default` 1px, 목록 항목 사이) · `strong`(`border-strong`, 더 또렷하게) · `thick`(8px `background-lower` 띠, 화면 영역 구분, 가로선만)
  - `inset`: 좌우 20px 여백(가로선만)
  - 여백만으로 나뉘면 선을 더하지 않습니다. 선 색을 `className`으로 바꾸지 않습니다

## 규칙

- 브레이크포인트 접두어는 `tablet:`(768px~)과 `desktop:`(1024px~)뿐이고, Tailwind 기본 `sm:` `md:` `lg:`는 없습니다. 보통은 `Grid.Item`의 `span`으로 처리하므로 접두어를 직접 쓸 일이 없습니다.
- **글자 크기는 구간과 상관없이 고정**입니다. 반응형은 컬럼 수·거터·여백으로만 합니다.
- 간격은 Figma 스케일 12단계(`p-1` 4px … `p-24` 96px, 번호 = px ÷ 4)만 씁니다. `p-5`는 20px입니다.
- `Grid.Item`의 `span`에 구간마다 넣을 수 있는 최댓값이 다릅니다(모바일 4, 태블릿 8, 데스크톱 12). 타입이 막아 주니 이 범위를 넘기지 않습니다.
