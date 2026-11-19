# RatioBar 사용 규칙

`RatioBar`를 쓰거나 고칠 때 이 문서를 따릅니다. 출처는 Figma `Ratio Bar`(node `2501:124784`: Size 3 × Segments 3 · 4 · 5 변형 9개, `Ratio Bar Guidelines`는 아직 없음)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **전체를 100%로 보고 여러 구간의 비율을 한 줄 막대로 보여 주는 표시 전용 부품**입니다. 도미넌스처럼 구간이 나뉘어 합이 100%가 될 때 씁니다. 눌러도 동작이 없습니다.
- 상태·이벤트가 없어서 `"use client"`가 없습니다. 서버 컴포넌트에서 바로 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다. 폭은 부모를 채웁니다(Figma 360).

## 언제 쓰나요

- 시장 도미넌스(비트코인·이더리움·스테이블코인…)처럼 **전체 대비 구간별 점유율**을 한눈에 보여 줄 때.
- 시간에 따른 값 변화는 차트를, 진행 정도(0~100%)는 진행 막대를, 등락 표시는 `PriceChange`를 씁니다.

## 구성

| 구성                     | 선택지             | 설명                                                                   |
| ------------------------ | ------------------ | ---------------------------------------------------------------------- |
| 크기(`size`)             | `sm` · `md` · `lg` | Figma Small · Medium · Large. 기본 `md`(저장소 기본). 구간별 값도 받음 |
| 구간(`items`)            | 3 · 4 · 5개        | 앞에서부터 진한 색. 구간 폭은 `value` 비율                             |
| 범례(`legend`)           | `true` · `false`   | 막대 위 색 점 + 이름 + 값. Figma Legend On · Off. 구간별 값도 받음     |
| 막대 안 값(`showValues`) | `true` · `false`   | 구간 안 가운데에 `56.2%`. `sm`은 항상 없음. 구간별 값도 받음           |

- **색**(구간 수마다 정해진 순서, 범례 점도 같은 색)
  - 3구간: `fill-brand` · `fill-brand-weak-pressed` · `fill-neutral-medium`
  - 4구간: `fill-brand` · `fill-brand-weak-pressed` · `fill-brand-weak` · `fill-neutral-medium`
  - 5구간: `fill-brand` · `fill-brand-weak-pressed` · `fill-brand-weak` · `fill-neutral-medium-pressed` · `fill-neutral-medium`
  - 막대 안 글자: 첫 구간 `text-on-fill`, 나머지 `text-strong`
- **크기**

  | `size`     | 막대 높이 · 모서리 | 범례 이름 · 값                               | 범례 점 | 막대 안 값                |
  | ---------- | ------------------ | -------------------------------------------- | ------- | ------------------------- |
  | `sm`       | 16 · 4             | Caption 2 Medium(11/16) · Caption 2 SemiBold | 6       | 없음                      |
  | `md`(기본) | 24 · 8             | Caption 1 Medium(12/18) · Caption 1 SemiBold | 8       | Caption 1 SemiBold(12/18) |
  | `lg`       | 32 · 10            | Body 5 Regular(13/20) · Body 5 Bold          | 8       | Body 5 Bold(13/20)        |

- 구간 사이 간격 2px, 범례와 막대 사이 12px, 범례 항목 사이 가로 16·세로 8(줄바꿈), 점과 글자 사이 6.
- 모서리 10(`lg`)은 Figma `radius-10`이고 반경 토큰(4·8·12…)에 없어 임의 값(`rounded-[10px]`)입니다.

## 접근성

- 그림 전체가 `role="img"`이고 이름은 `"비트코인 56.2%, 이더리움 11.8%, …"`입니다(`aria-label`로 바꿀 수 있음). 범례·막대는 `aria-hidden`이라 스크린리더에는 한 번만 읽힙니다. 범례를 끄거나 값을 숨겨도 이름은 같습니다.
- 색만으로 구간을 구분하지 않습니다. 범례에 이름과 값을 함께 두고, 범례를 끌 때는 다른 곳에 구간 이름이 있어야 합니다.

## 사용 규칙

- 구간은 **3~5개**로 씁니다(색이 그 범위만 정해져 있음). 2개 이하는 첫 색만, 6개 이상은 마지막 색이 반복됩니다.
- `value`는 퍼센트 숫자(`56.2`)이고 `%`는 컴포넌트가 붙입니다. 소수점 자릿수는 `fractionDigits`로 맞춥니다(`9` → `fractionDigits={1}`이면 `9.0%`, 없으면 `9%`). 합이 100이 아니어도 막대는 전체를 채웁니다.
- 같은 화면에서는 `size`를 하나로 맞춥니다. 좁은 구간은 값이 `…`로 줄어듭니다(`min-width: 1px`이라 아주 작은 값도 보임).
- 막대를 `div` 폭 계산으로 직접 만들지 않습니다.

## Props 요약

`size`("md") · `items`(필수) · `showValues`(true) · `fractionDigits` · `legend`(true) · `className` · 나머지 `<div>` 속성. `size`·`legend`·`showValues`는 구간별 객체(`{ base, tablet, desktop }`)를 받습니다.

## 개발 메모(Figma에 없어서 코드에서 더한 것, 2026-11)

- Figma의 `showValue1~5`·`value1~5`·`label1~5` 낱개 속성은 `items`(이름·값 배열)와 `showValues` 하나로 묶었습니다. 구간(세그먼트)마다 값 표시를 따로 켜고 끄는 일은 지원하지 않고, 화면 폭(구간별 객체)에 따라 전체를 켜고 끌 수 있습니다(`showValues`).
- 범례를 구간별 객체로 받는 것과 접근성 이름은 코드에서 더했습니다.
