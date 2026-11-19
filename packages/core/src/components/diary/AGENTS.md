# Diary 사용 규칙

`Diary`를 쓰거나 고칠 때 이 문서를 따릅니다.

- **출처(Figma)**: `Calendar Day Cell` 2467:123204 외 변형 14개(Tone × Selected × State), `Calendar Day Strip` 2467:123316, 가이드라인 `Diary Guidelines` 2467:122780. Figma 이름은 `Calendar Day Cell`이지만 코드 이름은 `Diary`입니다(2026-11 결정).
- **한 줄 성격**: 날짜별 일정을 가로로 넘겨 볼 때 쓰는 날짜 칸 줄. 요일·날짜·일정 뱃지가 한 칸에 쌓이고, 누르면 그날 일정을 엽니다.

## 언제 쓰나요

- 시장 일정, 언락 일정처럼 **날짜별 일정 개수를 한눈에** 보고 하루를 골라 자세히 열 때
- 한 달 전체를 보여 주거나 날짜를 입력받을 때는 `Calendar`·`DatePicker`를 씁니다.

## 구성

| 구성     | 값                                                                                          |
| -------- | ------------------------------------------------------------------------------------------- |
| 칸       | 폭 96 · 최소 높이 142 · 여백 가로 8 · 세로 12 · 쌓는 간격 4 · 오른쪽 1px `border-default`   |
| 글자     | 요일 Caption 1 Medium · 날짜 Body 2 Bold · 뱃지 Caption 2 SemiBold(`Badge` weak sm)         |
| Tone     | Default(요일 `text-subtle`·날짜 `text-strong`) · Holiday(`text-up`) · Today(`text-brand`)   |
| Selected | 배경 `fill-neutral-weak` · 윗줄 2px `border-selected`. 오늘이면 파랑 윗줄이 먼저            |
| State    | Normal · Pressed(`fill-brand-weak` 배경, 마우스를 올렸을 때) · Disabled(50% 흐림, 지난 날)  |
| 윗줄     | 기본 1px `border-strong` · 오늘 2px `border-brand`                                          |
| 더보기   | `+N` = `Badge` fill neutral md(`fill-neutral-pressed`). 보이는 뱃지는 최대 2개(`maxEvents`) |
| 가장자리 | 넘친 쪽만 흐림(왼쪽 24 · 오른쪽 28, `background-default`에서 투명으로)                      |

Tone은 prop이 아니라 날짜에서 정해집니다: `today`와 같으면 Today, 일요일·`holidays`에 있으면 Holiday, 나머지 Default. 오늘이 일요일이어도 Today가 먼저입니다. Disabled는 `min`보다 앞선 날과 `disabledDates`입니다.

## 접근성

- 칸마다 `button`입니다. 이름은 "11월 18일 수요일" + "오늘" + 공휴일 이름 + "일정 N개"이고, 뱃지는 `aria-hidden`입니다(개수는 이름에 들어 있음).
- 선택은 `aria-pressed`, 오늘은 `aria-current="date"`입니다. 오늘·선택은 색만이 아니라 윗줄 굵기·글자("오늘")로도 구분됩니다.
- Tab으로 칸마다 이동하고 Enter·Space로 고릅니다. 포커스 테두리는 안쪽에 그립니다.
- 마우스는 끌어서 넘길 수 있고(`useDragScroll`), 터치·트랙패드는 브라우저 스크롤을 씁니다. 스크롤바는 숨깁니다(가장자리 흐림이 넘친 쪽을 알림).

## 사용 규칙

- 권장: 뱃지는 최대 2개만 보여 주고 나머지는 `+N`으로 알립니다. 일정 종류는 `Badge` 색으로 구분하고 **범례를 같이** 보여 줍니다.
- 금지: 날짜 칸에 일정 제목을 길게 쓰지 않습니다(뱃지는 1~4자). 제목은 날짜를 눌러 연 곳에서 보여 줍니다.
- 날짜는 `YYYY-MM-DD` 문자열이고 `Date`를 받지 않습니다. `today`는 렌더 중 `new Date()`로 만들지 않고 서버에서 넘깁니다.
- 공휴일은 계산할 수 없어서 `holidays` 데이터로 받습니다. 일요일은 자동으로 빨강입니다.

## Props 요약

`start`(필수) · `count`(7) · `today`(필수) · `value`·`defaultValue`·`onChange` · `events` · `maxEvents`(2) · `holidays` · `min` · `disabledDates` · `className`.

## 개발 메모

- 반응형 prop은 없습니다. 칸 크기(96×142)는 Figma 고정값이고 화면 폭은 가로 스크롤이 흡수합니다.
- Figma에 없는 것을 코드에서 더했습니다(2026-11): `events`의 `color`(Figma는 brand·teal 두 가지 예시만), `holidays`·`disabledDates`·`min` 데이터 입력, 접근성 이름. 시안에서 칸 키보드 이동(←→)은 아직 정하지 않아 Tab 이동만 있습니다.
