# ToggleIcon 사용 규칙

`ToggleIcon`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Toggle Icon`(node `2316:39931`)과 `Toggle Icon Guidelines`(node `2316:40004`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **눌러서 켜고 끄는 아이콘 하나**입니다. 관심 코인, 좋아요, 북마크처럼 상태를 유지합니다.
- 켜짐 상태를 직접 가질 수 있어서 `"use client"`가 붙어 있습니다. 서버 컴포넌트에서 `defaultActive`만 넘겨 바로 써도 되고, `onActiveChange`를 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.

## Icon Button과 차이

|      | Toggle Icon                 | Icon Button           |
| ---- | --------------------------- | --------------------- |
| 목적 | 켜고 끄는 상태를 유지해요   | 한 번 누르면 동작해요 |
| 모양 | 꺼지면 Line, 켜지면 Fill    | 아이콘 그대로         |
| 예시 | 관심 코인 · 좋아요 · 북마크 | 닫기 · 더보기 · 공유  |

## 구성

| 구성 | 선택지                          | 설명                           |
| ---- | ------------------------------- | ------------------------------ |
| 크기 | Large · Medium · Small · XSmall | 카드 위는 Medium, 목록은 Small |
| 켜짐 | Active True · False             | True는 채움(Fill) 아이콘       |
| 상태 | Normal · Pressed · Disabled     | Hover는 Pressed와 같아요       |

- **크기(`size`)**: `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48, 아이콘 14 · 16 · 20 · 24. 모두 원형이고 `IconButton`과 같습니다. 구간별 값도 받습니다(`{ base: "sm", desktop: "md" }`).
- **색**: 꺼짐 `icon-default`(gray-700), 켜짐 `icon-brand`(blue-600), hover·누름 원형 바탕 `fill-neutral-weak`(gray-100), 비활성 `icon-disabled`(gray-400, 켜짐·꺼짐 모두).
- **아이콘(`icon`)**: MINT 아이콘 요소(`<StarIcon />`)를 넘기면 켜질 때 같은 아이콘에 `variant="fill"`을 줘서 채움으로 그립니다. MINT 아이콘이 아니면 `activeIcon`을 함께 넘깁니다.

```tsx
// 비제어: 컴포넌트가 상태를 가진다
<ToggleIcon icon={<StarIcon />} aria-label="관심 코인" />

// 제어: 사용하는 쪽이 상태를 가진다
<ToggleIcon
  icon={<StarIcon />}
  aria-label="관심 코인"
  size="sm"
  active={favorite}
  onActiveChange={setFavorite}
/>
```

## 사용 규칙

| 구분 | 내용                                                          |
| ---- | ------------------------------------------------------------- |
| 권장 | 같은 아이콘의 선·채움만 바꿔 상태를 보여요                    |
| 권장 | 이름은 상태와 관계없이 같게 써요("관심 코인")                 |
| 금지 | 한 번 누르면 끝나는 동작(닫기·공유)에 쓰지 않아요. IconButton |
| 금지 | 켜고 끌 때 다른 아이콘으로 바꾸지 않아요                      |

## 접근성

- `<button aria-pressed>`로 그려서 켜짐 여부가 스크린리더에 읽힙니다. 이름에 "켜짐/꺼짐"을 넣지 않습니다.
- `aria-label`은 타입에서 필수입니다.
- 터치 화면에서 `xs`·`sm`은 눌림 영역이 44px로 넓어집니다.

## Props 요약

`icon`(필수) · `activeIcon` · `aria-label`(필수) · `active` · `defaultActive` · `onActiveChange` · `size` · `disabled`와 나머지 `<button>` 속성. 자세한 표는 docs의 Toggle icon 페이지를 봅니다.
