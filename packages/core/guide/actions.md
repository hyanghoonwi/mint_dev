# 액션

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Button`** — 텍스트 버튼. 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다).
  - `variant`: `primary`(기본, 주요 동작) · `tint`(보조 강조) · `line`(일반) · `danger`(되돌리기 어려운 동작)
  - `size`: `sm` 32 · `md` 40(기본) · `lg` 48 · `xl` 56px
  - `fullWidth`: 부모 폭을 꽉 채웁니다. 모바일 하단 버튼 등
  - `leftAddon`(텍스트 앞) · `rightAddon`(텍스트 뒤)에 아이콘 등, `type`(기본 `"button"`), 나머지 `<button>` 속성
