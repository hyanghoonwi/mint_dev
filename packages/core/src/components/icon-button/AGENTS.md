# IconButton 사용 규칙

`IconButton`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Icon Button`(node `2201:10957`)과 `Icon Button Guidelines`(node `2201:11198`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **아이콘만으로 특정 동작을 실행하는 원형 버튼**입니다. 의미 전달이 약하므로 꼭 필요한 곳에만 쓰고 이름(`aria-label`)을 붙입니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

글자 없이 동작을 실행해요.

|        | Icon Button                | Button                 | Toggle Icon               |
| ------ | -------------------------- | ---------------------- | ------------------------- |
| 목적   | 아이콘으로 동작을 실행해요 | 글자로 동작을 실행해요 | 켜고 끄는 상태를 유지해요 |
| 예시   | 닫기, 더보기, 공유         | 확인, 제출, 삭제       | 관심 코인, 좋아요         |
| 레이블 | 없어요 (aria-label 필수)   | 있어요                 | 없어요 (aria-label 필수)  |

Toggle Icon은 MINT에 아직 없습니다.

## 구성

종류와 크기를 골라요.

| 구성       | 선택지                                 | 쓰는 곳                                  |
| ---------- | -------------------------------------- | ---------------------------------------- |
| 종류(Type) | Normal · Background · Outlined · Solid | Normal은 아이콘만, Solid는 가장 강조해요 |
| 크기       | Large · Medium · Small · XSmall        | 기본은 Medium, 표나 촘촘한 목록은 XSmall |
| 뱃지       | 켜고 끌 수 있어요                      | 알림처럼 새 소식을 점으로 알려요         |
| 상태       | Normal · Pressed · Disabled            | Hover는 Pressed와 같아요                 |

- **종류(`variant`)**: `normal`(배경 없음, 기본) · `background`(회색 바탕 `fill-neutral-medium`) · `outline`(흰 바탕·회색 테두리 `border-strong`, Figma의 Outlined) · `solid`(브랜드 `fill-brand`, 흰 아이콘). hover·누름은 한 단계 진해집니다(`fill-neutral-weak` · `fill-neutral-medium-pressed` · `fill-brand-pressed`).
- **비활성(`disabled`)**: 아이콘이 `icon-disabled`로 바뀌고, `solid`는 회색 바탕(`fill-disabled`), `outline`은 연한 테두리(`border-disabled`)입니다.
- **크기(`size`)**: `Button`과 같은 이름·높이입니다. `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48, 아이콘은 14 · 16 · 20 · 24. 모두 원형입니다. **구간별 값**도 받습니다: `size={{ base: "sm", tablet: "md" }}`(빈 구간은 앞 구간 값을 이어받음). `variant`는 구간별 값을 받지 않습니다.
- **뱃지(`badge`)**: 오른쪽 위 8px 빨간 점(`fill-danger`). 이름에 "(새 소식)"이 붙어 스크린리더에도 알립니다.
- **아이콘(`icon`)**: MINT 아이콘 컴포넌트를 넘기면 크기가 버튼에 맞춰지고 색은 버튼이 정합니다.

```tsx
<IconButton icon={<XIcon />} aria-label="닫기" />
<IconButton icon={<DotsThreeIcon />} aria-label="더보기" variant="background" size="sm" />
<IconButton icon={<BellIcon />} aria-label="알림" badge />
<IconButton icon={<PlusIcon />} aria-label="코인 추가" variant="solid" size="lg" />
```

## 사용 규칙

누구나 아는 아이콘만 써요.

| 구분 | 내용                                                              |
| ---- | ----------------------------------------------------------------- |
| 권장 | 닫기(X), 더보기(⋯)처럼 의미가 널리 알려진 아이콘을 써요           |
| 권장 | Tooltip이나 aria-label로 이름을 함께 제공해요                     |
| 금지 | 의미가 모호한 아이콘만으로 중요한 동작을 맡기지 않아요            |
| 금지 | 같은 줄에 Icon Button을 4개 이상 늘어놓지 않아요. 더보기로 묶어요 |

- `aria-label`은 타입에서 필수입니다. 동작을 짧은 동사·명사로 씁니다("닫기", "공유").
- 중요한 동작(삭제, 제출)은 글자가 있는 `Button`을 씁니다.
- `solid`는 화면의 가장 중요한 아이콘 동작 하나에만 씁니다.

## 접근성

누구나 쓸 수 있도록 다음을 지켜 주세요.

- **터치 영역은 44px 이상이에요:** XSmall과 Small은 주변 여백을 포함해 44px을 확보해요. 보이는 크기는 그대로 두고 터치 화면에서 눌림 영역만 넓어집니다.
- 이름(`aria-label`)이 없으면 스크린리더가 무엇인지 알 수 없습니다. 꼭 붙입니다.
- 키보드 포커스 링은 항상 보입니다(`focus-visible`).

## Props 요약

`icon`(필수) · `aria-label`(필수) · `variant` · `size` · `badge` · `disabled` · `onClick`과 나머지 `<button>` 속성. 자세한 표는 docs의 Icon button 페이지를 봅니다.
