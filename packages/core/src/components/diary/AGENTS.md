# Diary 사용 규칙

`Diary`를 쓰거나 고칠 때 이 문서를 따릅니다.

- **출처(Figma)**: `Calendar Day Cell` 2493:124392 외 변형 14개(Tone × Selected × State), `Calendar Day Strip` 2493:124561, 가이드라인 `Diary Guidelines` 2467:122780. Figma 이름은 `Calendar Day Cell`이지만 코드 이름은 `Diary`입니다(2026-11 결정).
- **한 줄 성격**: 날짜별 일정을 가로로 넘겨 볼 때 쓰는 날짜 칸 줄. 요일·날짜·일정 칩이 한 칸에 쌓이고, 누르면 그날 일정을 엽니다.

## 언제 쓰나요

- 시장 일정, 언락 일정처럼 **날짜별 일정 개수를 한눈에** 보고 하루를 골라 자세히 열 때
- 한 달 전체를 보여 주거나 날짜를 입력받을 때는 `Calendar`·`DatePicker`를 씁니다.

## 구성

| 구성     | 값                                                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 칸       | 폭 96 · 최소 높이 142 · 여백 가로 8 · 세로 12 · 쌓는 간격 4 · 오른쪽 1px `border-default`                                                                             |
| 글자     | 요일 Caption 1 Medium · 날짜 Body 2 Bold · 일정 칩 Caption 2 Medium                                                                                                   |
| 일정 칩  | 높이 22 · 최대 폭 80 · 모서리 8 · `fill-neutral-weak` · 여백 왼쪽 4 오른쪽 6 · 간격 4 · 앞에 16px 동그란 이미지(`image`, 선택) · 문구는 `text-primary`, 넘치면 말줄임 |
| Tone     | Default(요일 `text-subtle`·날짜 `text-strong`) · Holiday(`text-up`) · Today(`text-brand`)                                                                             |
| Selected | 배경 `fill-neutral-weak` · 윗줄 2px `border-selected`. 오늘이면 파랑 윗줄이 먼저                                                                                      |
| State    | Normal · Pressed(`fill-brand-weak` 배경, 마우스를 올렸을 때. 선택한 칸도 같음) · Disabled(50% 흐림, 지난 날)                                                          |
| 윗줄     | 기본 1px `border-strong` · 오늘 2px `border-brand`                                                                                                                    |
| 더보기   | `+N` = `fill-neutral-pressed` 칩(여백 가로 6 세로 2 · Caption 2 SemiBold · `text-on-fill`). 보이는 칩은 최대 2개(`maxEvents`)                                         |
| 가장자리 | 넘친 쪽만 흐림(왼쪽 24 · 오른쪽 28, `background-default`에서 투명으로)                                                                                                |

Tone은 prop이 아니라 날짜에서 정해집니다: `today`와 같으면 Today, 일요일·`holidays`에 있으면 Holiday, 나머지 Default. 오늘이 일요일이어도 Today가 먼저입니다. Disabled는 `min`보다 앞선 날과 `disabledDates`입니다.

## 접근성

- 칸마다 `button`입니다. 이름은 "11월 18일 수요일" + "오늘" + 공휴일 이름 + "일정 N개"이고, 칩은 `aria-hidden`입니다(개수는 이름에 들어 있음).
- 선택은 `aria-pressed`, 오늘은 `aria-current="date"`입니다. 오늘·선택은 색만이 아니라 윗줄 굵기·글자("오늘")로도 구분됩니다.
- Tab으로 칸마다 이동하고 Enter·Space로 고릅니다. 포커스 테두리는 안쪽에 그립니다.
- 마우스는 끌어서 넘길 수 있고(`useDragScroll`), 터치·트랙패드는 브라우저 스크롤을 씁니다. 스크롤바는 숨깁니다(가장자리 흐림이 넘친 쪽을 알림).

## 사용 규칙

- 권장: 칩은 최대 2개만 보여 주고 나머지는 `+N`으로 알립니다. 일정 종류는 칩의 이미지·문구로 구분합니다(Figma 가이드라인의 "Badge로 구분하고 범례를 같이" 문장은 칩이 중립색 하나라 코드에서는 이미지·문구로 바꿨습니다, 2026-11).
- 금지: 날짜 칸에 일정 제목을 길게 쓰지 않습니다(칩은 최대 80px이고 넘치면 말줄임). 제목은 날짜를 눌러 연 곳에서 보여 줍니다.
- 날짜는 `YYYY-MM-DD` 문자열이고 `Date`를 받지 않습니다. `today`는 렌더 중 `new Date()`로 만들지 않고 서버에서 넘깁니다.
- 공휴일은 계산할 수 없어서 `holidays` 데이터로 받습니다. 일요일은 자동으로 빨강입니다.

## Props 요약

`start`(필수) · `count`(7) · `today`(필수) · `value`·`defaultValue`·`onChange` · `events`(`{ label, image? }`) · `maxEvents`(2) · `holidays` · `min` · `disabledDates` · `className`.

## 개발 메모

- 반응형 prop은 없습니다. 칸 크기(96×142)는 Figma 고정값이고 화면 폭은 가로 스크롤이 흡수합니다.
- Figma에 없는 것을 코드에서 더했습니다(2026-11): `events`의 `image`(칩 앞 이미지는 Figma 변형 속성이라 주소로 받음), `holidays`·`disabledDates`·`min` 데이터 입력, 접근성 이름. 시안에서 칸 키보드 이동(←→)은 아직 정하지 않아 Tab 이동만 있습니다.
