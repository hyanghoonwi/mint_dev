# ProgressBar 사용 규칙

`ProgressBar`를 쓰거나 고칠 때 이 문서를 따릅니다. 출처는 Figma `Progress Bar`(node `2501:125255`: Type 2 × Status 3 × Percent 5 변형)와 `Progress Bar Guidelines`(node `2493:124257`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **진행 정도를 가로 막대로 보여 주는 표시 전용 부품**입니다. 눌러도 동작이 없습니다.
- 상태·이벤트가 없어서 `"use client"`가 없습니다. 서버 컴포넌트에서 바로 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다. 폭은 부모를 채우고 높이는 6으로 고정이라 구간별 prop이 없습니다.

## 언제 쓰나요

- **끝까지 얼마나 남았는지 아는** 작업: 파일 업로드, 단계 진행.
- **끝을 알 수 없는** 로딩은 `Circular`(또는 `Skeleton`)를 씁니다. 값 사이의 비율(도미넌스 등)은 `RatioBar`입니다.

## 구성

| 구성           | 선택지                             | 설명                                                                                           |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| 타입(`type`)   | `default` · `diverging`            | `default`는 왼쪽에서 채움(0 ~ 100%), `diverging`은 가운데 기준선에서 양쪽으로(−100 ~ 100)      |
| 값(`value`)    | 숫자                               | 채워진 비율(Figma Percent 0% · 25% · 50% · 75% · 100%는 예시일 뿐 연속 값). 범위를 넘으면 자름 |
| 상태(`status`) | `normal` · `negative` · `positive` | `default`에서만. 진행 중(brand) · 실패(danger) · 완료(success)                                 |

- **트랙**: 높이 6(Figma `spacing-6`, 간격 스케일에 없어 임의 값 `h-[6px]`), 모서리 `radius-full`, 색 `fill-neutral-weak`. 폭은 부모를 채우고 채움도 같이 늘어납니다.
- **채움 색**: `default` `fill-brand` · `fill-danger` · `fill-success`. `diverging`은 값의 부호로 정해집니다: 양수는 오른쪽으로 `fill-up`(빨강), 음수는 왼쪽으로 `fill-down`(파랑)이고, 한쪽 끝이 전체 폭의 50%입니다(`value` 100 = 가운데에서 끝까지).
- **`diverging` 가운데 기준선**: 폭 1 · 높이 12(막대 위아래로 3씩 나옴) `border-strong`. 값이 0이면 기준선 대신 가운데 점(지름 6, `text-subtle`)만 보입니다.
- 채움이 움직일 때 300ms 전환이고, 움직임 줄이기 설정이면 바로 바뀝니다.

## 접근성

- `role="progressbar"`, `aria-valuemin`(`default` 0 · `diverging` −100) · `aria-valuemax`(100) · `aria-valuenow`(자른 값) · `aria-valuetext`(`"50%"`).
- **이름은 사용하는 쪽이 `aria-label`로 줍니다**(예: "업로드 진행"). 막대 안쪽은 장식이라 `aria-hidden`입니다.
- 색만으로 상태를 알리지 않습니다. 실패(`negative`)·완료(`positive`)는 근처에 글자나 아이콘으로도 알립니다.

## 사용 규칙

- `value`는 숫자(퍼센트)로 넘깁니다. 문자열 `"50%"`를 받지 않습니다. `default`는 0~100, `diverging`은 −100~100입니다.
- `diverging`은 증감처럼 **기준(0)에서 양쪽으로** 벌어지는 값에만 씁니다. 시세 색(빨강 상승·파랑 하락)을 그대로 따릅니다.
- 색은 `status`로 고르고 `className`으로 덮어쓰지 않습니다. 막대를 `div` 폭 계산으로 직접 만들지 않습니다.
- 숫자를 함께 보여 주려면 옆에 `Text`를 둡니다(이 컴포넌트는 숫자를 그리지 않습니다).

## Props 요약

`type`("default") · `value`(필수) · `status`("normal") · `aria-label` · `className` · 나머지 `<div>` 속성.

## 개발 메모

- Figma의 Percent 5단계(0·25·50·75·100)는 변형 이름일 뿐이라 코드는 연속 값(`value`)으로 받습니다(가이드: "막대 폭은 쓰는 곳에 맞춰 늘리고 채움도 같이 늘어나요").
- Figma `diverging`은 Status가 Normal(0%만) · Positive · Negative로 나뉘어 있어서, 코드는 `status` 대신 `value`의 부호로 방향·색을 정합니다(2026-11 결정). 애니메이션·`aria-*`·값 자르기는 Figma에 없어 코드에서 더했습니다.
- 높이 6은 반응형이 아닌 고정이라 `size` prop을 두지 않았습니다.
