# Chip 사용 규칙

`Chip`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Chip`(node `2200:8621`)과 `Chip Guidelines`(node `2200:9392`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **필터나 카테고리처럼 선택 상태가 있는 알약형 요소**입니다. 행동을 실행하는 `Button`과 달리 값을 고르거나 조건을 바꿀 때 씁니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.
- 칩 여러 개를 한 줄로 묶어 **하나만 고르는 목록**(넘치면 가로 스크롤, "전체" 칩)은 `Category`를 씁니다. `Chip`은 칩 하나이고, 묶는 방식(하나만·여러 개)은 사용하는 쪽이 정합니다.

## 언제 쓰나요

Chip은 값을 고르고, 행동은 Button이 맡아요.

|           | Chip                        | Button             |
| --------- | --------------------------- | ------------------ |
| 목적      | 값을 고르거나 조건을 바꿔요 | 행동을 실행해요    |
| 선택 상태 | Active로 선택 여부를 보여요 | 선택 상태가 없어요 |
| 예시      | 전체, 시그널, 에어드랍      | 확인, 제출, 삭제   |
| 개수      | 보통 2개 이상 묶어서 써요   | 단독으로 써도 돼요 |

## 구성

종류, 크기, 모양을 서비스 전체에서 통일해요.

| 구성      | 선택지                                            | 쓰는 곳                                         |
| --------- | ------------------------------------------------- | ----------------------------------------------- |
| 종류      | `solid` · `outline`                               | 흰 화면에서는 Solid, 회색 배경 위에서는 Outline |
| 크기      | `lg`(Large 40) · `md`(Medium 32) · `sm`(Small 28) | 기본은 Medium, 촘촘한 목록은 Small              |
| 모양      | `square` · `pill`                                 | 한 서비스에서는 한 가지만 써요                  |
| 앞뒤 구성 | 아이콘 · 이미지 · 카운트                          | 한 Chip에는 하나만 붙여요                       |

- **선택(`active`)**: `solid`는 회색 칩(`fill-neutral-medium`, 글자 `text-secondary`) → 검정 칩(`fill-neutral`, 흰 글자). `outline`은 흰 칩·연회색 테두리(`border-strong`) → 진한 테두리(`border-selected`)·진한 글자(`text-strong`). hover·누름은 한 단계 진해집니다(Figma Pressed).
- **비활성(`disabled`)**: 회색 바탕(`fill-disabled`) 또는 흰 바탕·연한 테두리(`border-disabled`)에 회색 글자(`text-disabled`).
- **크기**: 구간별 값도 받습니다(`size={{ base: "sm", tablet: "md" }}`, 빈 구간은 앞 구간 값을 이어받음). Large 40(좌우 16, Pill 20, 모서리 10) · Medium 32(좌우 12, Pill 16, 모서리 8) · Small 28(좌우 12, Pill 16, 모서리 8, 글자 Label 3). 아이콘·이미지는 16(Small 14)입니다.
- **앞뒤 구성**: `leftAddon`·`rightAddon`(아이콘, Figma의 leading·trailing icon. `Button`과 같은 이름), `leadingImage`(둥근 이미지, 코인 로고 등), `count`(개수, 기본 회색·고른 solid는 흰 글자 80%). Figma customize의 `label`은 `children`, `count text`는 `count`입니다. 빨간 점 `badge`도 있습니다.
- 칩은 `<button type="button">`이고 선택 여부는 `aria-pressed`로 읽힙니다. 고르고 푸는 상태(`active`)는 사용하는 쪽이 가집니다.

```tsx
// 여러 개를 고르는 필터
const [filters, setFilters] = useState<string[]>(["signal"]);
const toggle = (id: string) =>
  setFilters((prev) =>
    prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
  );

<div role="group" aria-label="알림 종류" style={{ display: "flex", gap: 8 }}>
  <Chip
    active={filters.includes("signal")}
    onClick={() => toggle("signal")}
    count={12}
  >
    시그널
  </Chip>
  <Chip active={filters.includes("airdrop")} onClick={() => toggle("airdrop")}>
    에어드랍
  </Chip>
</div>;
```

## 사용 규칙

같은 줄의 Chip은 크기와 모양을 맞춰요.

| 구분 | 내용                                                    |
| ---- | ------------------------------------------------------- |
| 권장 | 하나만 고르는 필터는 선택(Active)을 하나만 켜요         |
| 권장 | 개수를 보여 줄 때는 Count를 써서 숫자로 알려요          |
| 금지 | 레이블을 8자 넘게 써서 두 줄로 만들지 않아요            |
| 금지 | Chip으로 화면 이동이나 제출 같은 행동을 실행하지 않아요 |

- 하나만 고르는 줄이라면 `Category`를 먼저 검토합니다(가로 스크롤·"전체"·키보드 이동이 들어 있음).
- 레이블은 한 줄로 둡니다(`whitespace-nowrap`). 길면 줄이지 말고 문구를 줄입니다.
- 행동(이동·제출·삭제)은 `Button`이나 링크를 씁니다.

## 접근성

누구나 쓸 수 있도록 다음을 지켜 주세요.

- **선택 상태는 색만으로 알리지 않아요:** 배경 대비와 글자 굵기로도 선택 여부를 구분해요. 고른 칩은 배경(테두리)과 글자 색이 함께 바뀌고, 스크린리더에는 `aria-pressed`로 알립니다.
- **터치 영역은 44px 이상이에요:** Small은 주변 여백까지 포함해 44px을 확보해요. `md`(32)·`sm`(28)은 터치 화면에서 눌림 영역만 44px로 넓어집니다. 칩 사이 간격은 8 이상 둡니다.
- 묶음에는 `role="group"`과 `aria-label`(예: "알림 종류")을 줍니다.
- `badge` 점은 스크린리더에 "(새 소식)"으로 읽힙니다. 키보드 포커스 링은 항상 보입니다(`focus-visible`).

## Props 요약

`variant` · `size` · `shape` · `active` · `children`(레이블) · `leftAddon` · `rightAddon` · `leadingImage` · `count` · `badge` · `disabled` · `onClick`과 나머지 `<button>` 속성. 자세한 표는 docs의 Chip 페이지를 봅니다.
