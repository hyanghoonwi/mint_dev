# Box 사용 규칙

`Box`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Box`(node `2391:88716`)와 `Box Guidelines`(node `2391:89028`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **콘텐츠를 담고 배치만 하는 범용 레이아웃 상자**입니다. 카드 안, 페이지 영역, 콘텐츠 묶음 어디서나 구조를 잡는 데 씁니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음, 훅·이벤트 없음).
- 다른 컴포넌트의 바탕으로도 씁니다. `Menu`의 겉 상자·항목 영역·하단 액션 줄·그룹이 Box로 만들어져 있습니다.

## 언제 쓰나요

| 구분      | Box                                      | Card(만들 예정)                     |
| --------- | ---------------------------------------- | ----------------------------------- |
| 목적      | 여러 요소를 묶고 정렬·간격·크기를 정해요 | 독립된 콘텐츠 한 덩어리를 보여 줘요 |
| 위치      | 카드 안, 페이지 영역, 콘텐츠 묶음        | 목록이나 그리드 안의 콘텐츠 단위    |
| 상태·구성 | Normal만, 제목·썸네일 없음               | Normal·Pressed, 제목·캡션           |

## 구성

| 구성                    | 선택지                                                          | 설명                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 방향(`direction`)       | `vertical`(기본) · `horizontal`                                 | 구간별 값도 받아요                                                                                                                           |
| 여백(`padding`)         | 0(기본) · 8 · 16 · 20 · 24                                      | spacing 변수(`p-0`·`p-2`·`p-4`·`p-5`·`p-6`). 구간별 값도 받아요                                                                              |
| 간격(`gap`)             | 0(기본) · 4 · 8 · 12 · 16 · 24 · 32                             | spacing 변수. 구간별 값도 받아요                                                                                                             |
| 정렬(`align`·`justify`) | Start · Center · End · Stretch / Start · Center · Between · End | 교차축 기본 `stretch`, 주축 기본 `start`                                                                                                     |
| 겉면 테두리(`tone`)     | None · Outline · Neutral · Brand · Success · Warning · Danger   | 테두리만 바꿔요                                                                                                                              |
| 그림자(`elevation`)     | None · Raised · Floating                                        | Raised는 흰 바탕 + `shadow-raised`(붙은 카드). Floating은 `background-floated` + `shadow-floating`(떠 있는 상자, Popover가 씀. 2026-11 추가) |
| 모서리(`radius`)        | 0 · 4 · 8(기본) · 12 · 16 · 20 · full                           | Figma Box Radius 변수 모드                                                                                                                   |
| 넘침(`overflow`)        | Visible · Hidden · Scroll                                       | Scroll은 Mint 기본 스크롤바                                                                                                                  |

- **Tone 색**: Outline `border-default` · Neutral `border-focus` · Brand `border-brand` · Success `fill-success` · Warning `fill-warning` · Danger `fill-danger`(모두 1px 테두리). Figma Surface도 테두리만 바꾸므로 tone에 배경을 넣지 않았습니다(2026-11 결정).
- **배경은 `className`의 색 토큰으로** 줍니다. Figma 가이드의 "배경(fill/*-weak)과 짝이 되는 테두리"는 이렇게 맞춥니다: `tone="brand" className="bg-fill-brand-weak"`, `success` → `bg-fill-success-weak`, `warning` → `bg-fill-warning-weak`, `danger` → `bg-fill-danger-weak`, `neutral` → `bg-fill-neutral-weak`. hex 색은 쓰지 않습니다.
- **Elevation**: Figma `shadow/normal/small`(0 2px 8px, 8%)을 `shadow-raised` 토큰으로 추가했습니다(2026-11). 테두리만 필요하면 `tone="outline"`을 씁니다.
- **모서리**: Figma 가이드 표에 24가 있지만 Figma 반경 변수에 24가 없어서 받지 않습니다(토큰이 생기면 추가).
- **크기**: Figma 기본 Fixed 160×80은 시안 견본입니다. 코드는 내용에 맞추고(Hug), 폭·높이는 `className`(`w-full`, `w-[240px]`)으로 정합니다.
- 단계에 없는 여백(예: Menu의 셀 여백 12)이 꼭 필요하면 간격 토큰 클래스(`p-3`)를 `className`으로 줍니다.

## 접근성

- 장식이 없는 일반 상자라 역할을 붙이지 않습니다. 문서 구조에 맞게 `as`로 태그(`section`·`nav`·`ul`·`li` 등)를 고르고, 필요하면 `role`·`aria-*`를 그대로 넘깁니다(Menu는 `role="menu"`).
- tone 색만으로 의미를 전하지 않습니다. 안의 글자로도 알립니다.

## 사용 규칙

| 구분 | 내용                                                            |
| ---- | --------------------------------------------------------------- |
| 권장 | 배경은 tone과 같은 의미의 `bg-fill-*-weak` 토큰을 className으로 |
| 권장 | 여백·간격은 정해진 단계만, 페이지 컬럼 배치는 Container·Grid로  |
| 금지 | hex 색, 임의 그림자(`shadow-[…]`), 임의 반경(`rounded-[…]`)     |

## Props 요약

`direction` · `padding` · `gap` · `align` · `justify` · `tone` · `elevation` · `radius` · `overflow` · `as`와 나머지 `<div>` 속성. 자세한 표는 docs의 Box 페이지를 봅니다.
