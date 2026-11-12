# Thumbnail 사용 규칙

`Thumbnail`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Thumbnail`(node `2304:35429`)과 `Thumbnail Guidelines`(node `2304:35671`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **이미지를 항상 같은 비율로 보여 주는 틀**입니다. 비율을 고르고 모서리·테두리·어두운 막(오버레이)을 켜고 끕니다.
- 상태·이벤트가 없어서 `"use client"`가 없습니다. 서버 컴포넌트에서 바로 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## Avatar와 차이

|      | Thumbnail                          | Avatar                    |
| ---- | ---------------------------------- | ------------------------- |
| 목적 | 콘텐츠 이미지를 보여 줘요          | 사람이나 대상을 나타내요  |
| 비율 | 1:1부터 21:9, 세로 비율까지 골라요 | 1:1 원형 또는 둥근 사각형 |
| 예시 | 뉴스, 카드, 상품 이미지            | 프로필, 거래소            |

## 구성

| 구성                | 선택지                            | 설명                                                          |
| ------------------- | --------------------------------- | ------------------------------------------------------------- |
| 비율(`aspectRatio`) | 1:1 · 4:3 · 16:9 · 21:9 등 17가지 | 가로는 16:9, 정사각형은 1:1을 기본으로 써요. 구간별 값도 받음 |
| 모서리(`radius`)    | `false` · `true`                  | 카드 위에서는 켜고, 전체 폭 이미지는 꺼요(8px)                |
| 테두리(`border`)    | `false` · `true`                  | 흰 배경에 흰 이미지가 올 때 켜요(1px `border-default`)        |
| 오버레이(`overlay`) | `false` · `true`                  | 이미지 위 글자의 대비를 확보할 때 켜요                        |

- **비율**: 가로형 `1:1` `5:4` `4:3` `3:2` `16:10` `1.618:1` `16:9` `2:1` `21:9`, 세로형 `4:5` `3:4` `2:3` `10:16` `1:1.618` `9:16` `1:2` `9:21`. CSS `aspect-ratio`로 정하고, 폭은 부모를 따릅니다.
- **바탕**: 이미지가 없거나 불러오기 전에는 `fill-neutral-weak` 바탕이 보이고, 이미지가 아예 없으면 가운데 이미지 아이콘(`icon-disabled`)이 보입니다.
- **오버레이 색**: Figma 기본은 `fill-pressed`(옅은 막, 5%)입니다. 글자를 올릴 때 대비가 부족하면 `overlayColor`로 진하게 바꿉니다(Figma customize: overlay color).
- **이미지 채우기**: `fit="cover"`(기본, 잘라서 채움) · `contain`(전체 보임). Figma customize: image fill.
- **Next.js 이미지**: core는 `next/image`를 쓰지 않습니다. 최적화가 필요하면 `image={<Image src={…} alt="…" fill sizes="…" />}`로 넘깁니다(틀이 `relative`라 `fill`이 맞습니다).

```tsx
<Thumbnail src={news.image} alt={news.title} aspectRatio="16:9" radius />
<Thumbnail
  aspectRatio="16:9"
  radius
  overlay
  overlayColor="rgba(0, 0, 0, 0.4)"
  image={<Image src={hero} alt="" fill sizes="100vw" priority />}
>
  <h2 className="absolute bottom-4 left-4 text-title-3-bold text-text-on-fill">제목</h2>
</Thumbnail>
```

## 사용 규칙

| 구분 | 내용                                                    |
| ---- | ------------------------------------------------------- |
| 권장 | 한 목록 안에서는 같은 비율과 모서리를 써요              |
| 권장 | 이미지가 로딩되기 전에 같은 비율의 Skeleton을 보여 줘요 |
| 금지 | 이미지를 비율에 맞지 않게 늘이거나 찌그러뜨리지 않아요  |
| 금지 | 이미지 위에 오버레이 없이 긴 글자를 올리지 않아요       |

## 접근성

- 의미 있는 이미지는 `alt`에 내용을 적고, 꾸밈용이면 `alt=""`로 둡니다.
- 바탕 아이콘·오버레이·테두리는 `aria-hidden`이라 읽히지 않습니다.

## Props 요약

`aspectRatio`(구간별) · `fit` · `radius` · `border` · `overlay` · `overlayColor` · `src` · `alt` · `image` · `children` · `loading`과 나머지 `<div>` 속성. 자세한 표는 docs의 Thumbnail 페이지를 봅니다.
