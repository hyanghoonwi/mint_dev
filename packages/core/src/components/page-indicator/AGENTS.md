# PageCounter · PageDots 사용 규칙

`PageCounter`·`PageDots`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Page Indicator`(node `2204:17256`)와 `Page Indicator Guidelines`(node `2204:17435`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **요소의 현재 위치를 안내하는 컴포넌트**입니다. 숫자로 알려 주는 Counter(`PageCounter`)와 점으로 알려 주는 Dot(`PageDots`)이 있습니다. 배너나 캐러셀, 이미지 갤러리 아래에 씁니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). **표시 전용**이라 누를 수 없습니다. 넘기기는 캐러셀 쪽이 맡고, 바뀐 위치를 `current`로 넘깁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

배너, 캐러셀, 이미지 갤러리 아래에 써요.

|         | Counter                | Dot                                 |
| ------- | ---------------------- | ----------------------------------- |
| 표시    | 현재 / 전체 숫자 (1/5) | 점으로 위치만 표시                  |
| 쓰는 곳 | 이미지가 많은 갤러리   | 배너, 온보딩처럼 개수가 적은 캐러셀 |
| 개수    | 제한 없어요            | 2~7개                               |

## 구성

배경에 맞춰 색을 골라요.

| 구성    | 선택지                       | 쓰는 곳                               |
| ------- | ---------------------------- | ------------------------------------- |
| 색      | Normal · Alternative · White | 밝은 배경은 Normal, 이미지 위는 White |
| 크기    | Medium · Small               | Medium이 기본이에요                   |
| 점 개수 | 2~7개                        | 8개 이상이면 Counter를 써요           |

- **공통**: `current`(현재 위치, 1부터)와 `total`(전체 개수)을 넘깁니다. `size`는 `md`(기본) · `sm`.
- **`PageCounter`**: `variant="normal"`(기본, 진한 바탕 `fill-neutral`·흰 글자) · `"alternative"`(연한 바탕 `fill-neutral-weak`·`text-secondary` 글자). 크기는 `md` 높이 28·좌우 12·Label 2 SemiBold, `sm` 높이 22·좌우 8·Label 3 SemiBold. 모양은 알약형입니다. Figma customize의 `label`은 `current`·`total`로 만들어집니다("1 / 10").
- **`PageDots`**: `variant="normal"`(기본, 현재 점 `fill-neutral`·나머지 `fill-neutral-medium`) · `"white"`(이미지 위, 현재 점 흰색·나머지 흰색 40%). 점은 `md` 8px·간격 8, `sm` 6px·간격 6. Figma customize의 `count`는 `total`입니다.
- 스크린리더에는 둘 다 "10개 중 1번째"처럼 읽힙니다(`role="img"`).

```tsx
<PageDots current={2} total={5} />
<PageDots current={1} total={4} variant="white" />   {/* 이미지 위 */}
<PageCounter current={3} total={24} />
<PageCounter current={3} total={24} variant="alternative" size="sm" />
```

## 사용 규칙

개수가 많으면 숫자로 바꿔요.

| 구분 | 내용                                                 |
| ---- | ---------------------------------------------------- |
| 권장 | 점은 7개 이하일 때만 써요                            |
| 권장 | 이미지 위에서는 White를 써서 대비를 확보해요         |
| 금지 | 점으로 클릭 이동을 만들지 않아요. 표시 전용이에요    |
| 금지 | 현재 위치가 아닌 점을 눈에 띄는 색으로 칠하지 않아요 |

- `total`이 8 이상이면 `PageDots` 대신 `PageCounter`를 씁니다.
- 점을 눌러 이동하게 만들지 않습니다(`onClick`을 붙이거나 버튼으로 감싸지 않음). 이동은 캐러셀의 넘기기·이전/다음 버튼이 맡습니다.
- 색을 `className`으로 덮어써 나머지 점을 강조하지 않습니다.

## Props 요약

- `PageCounter`: `current`(필수) · `total`(필수) · `variant`(`normal`·`alternative`) · `size`와 나머지 `<div>` 속성
- `PageDots`: `current`(필수) · `total`(필수) · `variant`(`normal`·`white`) · `size`와 나머지 `<div>` 속성

자세한 표는 docs의 Page indicator 페이지를 봅니다.
