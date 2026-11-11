# 로딩

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Circular`** — 로드 시간이 짧은 일반적인 상황에 쓰는 원형 로딩. 서버 컴포넌트에서도 쓸 수 있습니다(회전은 CSS 애니메이션).
  - `size`: 지름(px), 기본 28. 버튼 안에서는 `Button`의 `loading`이 알아서 크기를 맞춥니다(`xs` 12 · `sm`·`md` 16 · `lg` 20)
  - `color`: `default`(회색, 기본) · `brand` · `on-fill`(진한 배경 위의 흰색)
  - `label`: 스크린리더가 읽을 이름(기본 `로딩 중`). 장식용이면 `aria-hidden`을 줍니다
- **`SkeletonText`** — 텍스트 한 줄 자리. 서버 컴포넌트에서도 쓸 수 있습니다(`"use client"` 없음). 여러 줄은 쌓아서 만들고 마지막 줄은 짧게 둡니다.
  - `length`: `"100%"`(기본) · `"75%"` · `"50%"` · `"25%"` — 줄 칸 폭에 대한 비율
  - `align`: `leading`(기본) · `center` · `trailing` — 짧은 줄을 칸 안 어디에 둘지
  - `width`(기본 `"100%"`, 숫자는 px) · `height`(기본 16) · `color`
- **`SkeletonRectangle`** — 이미지·썸네일·카드처럼 네모난 자리. 서버 컴포넌트에서도 쓸 수 있습니다.
  - `radius`: `false`(기본) · `true`(8px) · 숫자(px)
  - `width`(기본 `"100%"`) · `height`(기본 80) · `color`
- **`SkeletonCircle`** — 아바타처럼 동그란 자리. 서버 컴포넌트에서도 쓸 수 있습니다.
  - `size`: 지름(px) `24` · `32` · `40`(기본) · `48` · `64` — `Avatar`와 같은 크기를 씁니다
  - `color`
- Skeleton 공통
  - `color`: `normal`(흰 바탕 위 회색, 기본) · `white`(회색 바탕 위 흰색)
  - `animate`: 빛 띠가 왼쪽에서 오른쪽으로 지나가는 효과(shimmer, 기본 `true`, CSS 애니메이션이라 서버 컴포넌트에서도 동작). 띠는 바탕보다 한 단계 진한 토큰 색. 움직임 줄이기 설정이면 멈춥니다
  - 모두 `aria-hidden`입니다. 불러오는 영역에 `aria-busy="true"`를 주고 다 불러오면 지웁니다
  - 실제 콘텐츠와 같은 모양·크기·배치로 둡니다. 영역 전체를 덩어리 하나로 덮지 않습니다
  - 색은 `className`·`style`로 덮어씁니다. 나머지 `<div>` 속성을 받습니다
  - 짧은 로딩·버튼 로딩은 `Circular`(`Button`의 `loading`)를 씁니다
  - Figma Loading Guidelines: 3초 넘게 보여 주지 않습니다(더 걸리면 진행 상황을 글로 알림). 한 화면에 `Circular`와 Skeleton을 섞어 쓰지 않습니다. 상세 규칙은 `components/skeleton/AGENTS.md`
