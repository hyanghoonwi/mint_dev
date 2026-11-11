# Skeleton 사용 규칙

`SkeletonText`·`SkeletonRectangle`·`SkeletonCircle`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Loading Guidelines`(node `2200:2924`)와 `Skeleton Text`(`2200:2694`)·`Skeleton Rectangle`(`2200:2807`)·`Skeleton Circle`(`2200:2859`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- 작업이 끝나기를 기다리는 동안 **콘텐츠가 들어올 자리**를 보여 주는 컴포넌트입니다. 짧은 대기는 `Circular`, 콘텐츠 자리는 Skeleton으로 보여 줍니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). Next.js의 `loading.tsx`에 바로 둘 수 있습니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다. `width`를 생략하면 부모 폭을 따라 줄어듭니다.

## 언제 쓰나요

대기 시간과 위치에 맞춰 골라요.

|         | Circular                   | Skeleton                          |
| ------- | -------------------------- | --------------------------------- |
| 쓰는 곳 | 대기 시간이 짧은 일반 상황 | 콘텐츠가 들어올 자리              |
| 모양    | 원형이 돌아가요            | 글자, 사각형, 원 모양의 자리 표시 |
| 예시    | 버튼 안, 새로고침          | 목록, 카드, 프로필 불러오기       |

## 구성

종류와 색을 골라요.

| 구성                | 선택지                      | 설명                                         |
| ------------------- | --------------------------- | -------------------------------------------- |
| `SkeletonText`      | 길이 100% · 75% · 50% · 25% | 정렬은 Leading · Center · Trailing이에요     |
| `SkeletonRectangle` | Radius False · True         | 크기는 인스턴스(`width`·`height`)에서 바꿔요 |
| `SkeletonCircle`    | 24 · 32 · 40 · 48 · 64      | 크기는 Avatar와 같아요                       |
| 색                  | Normal · White              | 어두운(회색) 배경에서는 White를 써요         |

- 텍스트 줄은 `length`(`"100%"` 기본 · `"75%"` · `"50%"` · `"25%"`)와 `align`(`leading` 기본 · `center` · `trailing`)을 고릅니다. 줄 높이는 기본 16이고 `height`로 바꿉니다.
- 네모는 `radius`(`false` 기본 · `true`=8px · 숫자 px)를 고르고 `width`(기본 부모 폭)·`height`(기본 80)로 크기를 맞춥니다.
- 원은 `size`(기본 40)를 같은 자리의 `Avatar` 크기와 맞춥니다.
- 색은 `color`입니다. 흰 바탕은 `normal`(기본), 회색 바탕은 `white`입니다. 색을 더 바꿔야 하면 `className`·`style`로 덮어씁니다. 투명도를 직접 정하려면 `animate={false}`로 깜빡임을 끕니다.
- 깜빡임은 `animate`(기본 `true`)입니다. 1.6초마다 밝아졌다 흐려지고, 같은 때 그려진 스켈레톤은 함께 깜빡입니다. Figma에는 움직임이 없어서 코드에서 정한 값입니다.

```tsx
<div aria-busy="true">
  <SkeletonCircle size={40} />
  <SkeletonText length="50%" />
  <SkeletonText length="75%" height={12} />
</div>

<SkeletonRectangle height={140} radius />   {/* 카드 썸네일 */}
<SkeletonText color="white" />              {/* 회색 바탕 위 */}
```

## 사용 규칙

**실제 모양과 닮게 보여 줘요.**

| 구분 | 내용                                                |
| ---- | --------------------------------------------------- |
| 권장 | Skeleton은 실제 콘텐츠의 크기와 줄 수에 맞춰 쌓아요 |
| 권장 | Circular는 버튼 안이나 새로고침처럼 좁은 곳에 써요  |
| 금지 | 3초 넘게 보여 주지 않아요. 진행 상황을 글로 알려요  |
| 금지 | 한 화면에 Circular와 Skeleton을 섞어 쓰지 않아요    |

- 실제 콘텐츠와 **같은 모양·크기·배치**로 둡니다. 콘텐츠가 들어와도 화면이 밀리지 않아야 합니다. 영역 전체를 덩어리 하나로 덮지 않습니다.
- 여러 줄 글은 `SkeletonText`를 줄 수만큼 쌓고, 마지막 줄은 `75%`나 `50%`로 짧게 둡니다.
- 3초가 넘게 걸리는 작업은 Skeleton만 두지 말고 "시세를 불러오고 있어요"처럼 진행 상황을 글로 알립니다.
- 한 화면(같은 영역)에서 로딩 표시는 하나로 통일합니다. 버튼 안 로딩(`Button`의 `loading`)은 예외입니다.

## 접근성

- Skeleton은 모양만 보여 주는 장식이라 모두 `aria-hidden`입니다. 스크린리더가 읽지 않습니다.
- 불러오는 영역에 `aria-busy="true"`를 주고, 다 불러오면 지웁니다.
- 밝아졌다 흐려지는 효과(`animate`, 기본 `true`)는 움직임 줄이기 설정(`prefers-reduced-motion`)을 켠 사용자에게는 멈춥니다.

## Props 요약

- `SkeletonText`: `length` · `align` · `color` · `animate` · `width` · `height`와 나머지 `<div>` 속성
- `SkeletonRectangle`: `radius` · `color` · `animate` · `width` · `height`와 나머지 `<div>` 속성
- `SkeletonCircle`: `size` · `color` · `animate`와 나머지 `<div>` 속성

자세한 표는 docs의 Skeleton 페이지를 봅니다.
