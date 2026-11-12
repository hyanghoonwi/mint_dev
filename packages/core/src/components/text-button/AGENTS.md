# TextButton 사용 규칙

`TextButton`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Text Button`(node `2301:34604`)과 `Text Button Guidelines`(node `2301:35218`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **글자만 있는 가장 약한 행동**입니다. 평소에는 배경 없이 글자만 보이고, 누르는 동안(hover 포함)만 연한 박스가 생깁니다. "전체 보기 >"처럼 문장 속·제목 옆 링크형 동작에 씁니다.
- 상태가 없어서 `"use client"`가 없습니다(Button과 같음). `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.
- **이동이면 `href`(`<a>`), 동작이면 `onClick`(`<button>`)**입니다. Next.js에서는 `linkComponent={Link}`를 넘깁니다(core는 `next/link`를 import하지 않음).

## Button(ghost)과 차이

|         | TextButton                 | Button (ghost)       |
| ------- | -------------------------- | -------------------- |
| 모양    | 글자만 보여요              | 연한 배경이 있어요   |
| 크기    | Ghost보다 작아요           | Button 크기를 따라요 |
| 쓰는 곳 | 문장 속, 제목 옆 보조 동작 | 독립된 약한 행동     |
| 예시    | 전체 보기, 자세히 보기     | 취소, 닫기           |

## 구성

| 구성              | 선택지                                | 설명                                                                            |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| 색(`color`)       | `primary` · `neutral`                 | Primary는 브랜드 색, Neutral은 회색 글자예요                                    |
| 크기(`size`)      | `xs` · `sm` · `md` · `lg`             | 본문 글자 크기에 맞춰 골라요. `xs`는 표와 목록 안에서 써요. 구간별 값도 받음    |
| 밑줄(`underline`) | `false` · `true`                      | 문장 속 링크는 밑줄로 눈에 띄게 해요                                            |
| 인라인(`inline`)  | `false` · `true`                      | 패딩과 눌림 박스가 없고 밑줄이 항상 켜져요. 문장 속 이동 링크                   |
| 아이콘            | `leftAddon` · `rightAddon`            | 앞 아이콘은 동작의 의미를 보조하고, 뒤 화살표(>)는 이동을 암시해요. 하나만 써요 |
| 상태              | Normal · Pressed · Disabled · Loading | Hover는 Pressed와 같아요                                                        |

- **크기**:

  | `size`     | 높이(기본 · `inline`) | 글자                  | 아이콘 | 패딩 · 모서리 |
  | ---------- | --------------------- | --------------------- | ------ | ------------- |
  | `xs`       | 20 · 16               | Label 3 Medium(12/16) | 16     | 6×2 · 6       |
  | `sm`       | 24 · 16               | Label 3 Medium(12/16) | 16     | 8×4 · 8       |
  | `md`(기본) | 28 · 20               | Label 2 Medium(14/20) | 16     | 8×4 · 8       |
  | `lg`       | 28 · 20               | Label 1 Medium(16/20) | 20     | 8×4 · 8       |

- **색**: primary 글자 `text-brand`, 누름 `text-brand-pressed` + 박스 `fill-brand-weak-pressed`(blue-100). neutral 글자 `text-secondary`(gray-700), 누름 `text-strong` + 박스 `fill-neutral-weak-pressed`(gray-200). 비활성 `text-disabled`. `inline`은 박스 없이 글자 색만 바뀝니다.
- **밑줄**: 글자 장식(text-decoration)이 아니라 줄(앞뒤 아이콘 포함) 아래에 따로 그린 1px 선입니다. 줄 바로 아래(1px 띄움)에 있어 글자·아이콘과 겹치지 않고 아이콘 끝까지 이어지며, 버튼 높이에는 영향이 없습니다.
- **로딩**: 글자를 숨기고(폭 유지) 진행 원을 가운데 보여 줍니다. 누를 수 없습니다.
- 터치 화면에서 박스형은 보이는 크기는 그대로 두고 눌림 영역만 44px로 넓힙니다.

```tsx
<TextButton href="/news" linkComponent={Link} color="neutral" size="sm" rightAddon={<CaretRightIcon />}>
  전체 보기
</TextButton>
<p>
  투자 위험은 <TextButton inline size="lg" href="/notice">투자 유의 안내</TextButton>에서 볼 수 있어요.
</p>
```

## 사용 규칙

| 구분 | 내용                                                             |
| ---- | ---------------------------------------------------------------- |
| 권장 | "전체 보기 >"처럼 보조 이동에 써요                               |
| 권장 | 문장 속에서는 밑줄을 켜서 링크임을 알려요                        |
| 금지 | 화면의 주된 행동(CTA)에 Text Button을 쓰지 않아요. Button을 써요 |
| 금지 | 두 개 이상을 한 줄에 붙여 놓지 않아요                            |

## 접근성

- **링크처럼 읽혀야 해요:** 이동이면 `href`(a 태그), 동작이면 `onClick`(button)으로 구분해요.
- **글자 색 대비를 지켜요:** Neutral과 Primary 모두 배경과 4.5:1 이상 대비를 유지해요.
- 링크가 `disabled`·`loading`이면 `href`를 빼고 `aria-disabled`를 붙여 이동을 막습니다.
- 포커스 링은 `focus-visible`일 때 보입니다.

## Props 요약

`color` · `size`(구간별) · `underline` · `inline` · `leftAddon` · `rightAddon` · `loading` · `disabled` · `href` · `linkComponent` · `children`과 나머지 `<button>` 속성. 자세한 표는 docs의 Text button 페이지를 봅니다.
