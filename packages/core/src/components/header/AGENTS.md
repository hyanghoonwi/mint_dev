# Header 사용 규칙

`Header`를 쓰거나 고칠 때 이 문서를 따릅니다.

- **출처(Figma)**: `Header Desktop` 2462:121821(Guest)·2462:121833(Member), `Header Mobile` 2462:121848(Guest)·2462:121854(Member), 가이드라인 `Header Guidelines` 2462:121862.
- **한 줄 성격**: 서비스 맨 위에 떠 있는 글로벌 내비게이션. 어두운 알약에 로고·메뉴·로그인(또는 프로필)이 들어갑니다.

## 언제 쓰나요

- 서비스 전체 상단 내비게이션(레이아웃에 한 번). 화면 안의 섹션 전환은 `Tab`, 조건 거르기는 `Category`입니다.

## 구성

| 구성      | 값                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 알약      | 높이 56 · `rounded-full` · 배경 `fill-alpha-900` · 그림자 `shadow-floating`                                                   |
| 데스크톱  | 768px~. 알약은 가운데·내용 폭. 안쪽 왼쪽 20·오른쪽 12, 칸 간격 8. 바깥 여백 위 32·아래 16·좌우 64 (spacing-64)                |
| 모바일    | ~767px. 알약은 가운데에 폭의 89.3333%(Figma 375에서 335, 비율 유지). 안쪽 왼쪽 20·오른쪽 8, 칸 간격 4. 바깥 여백 위 16·아래 8 |
| 로고      | 높이 32 칸(Figma는 자리표시 상자). 오른쪽에 12                                                                                |
| 메뉴 항목 | `TextButton`(`color="inverse"`, `md`, `rounded-full`): 평소 `text-on-fill-secondary`, 현재·올림 `text-on-fill`                |
| 로그인    | 데스크톱 높이 40·Label 2 Medium·좌우 16 / 모바일 높이 32·Label 3 Medium·좌우 12. `fill-brand`·`rounded-full`                  |
| 프로필    | `Avatar` 40 + 알림 점(8px, `fill-brand`, 흰 테두리 1.5px, 오른쪽 위)                                                          |
| 햄버거    | 모바일만. `IconButton`(md) + `ListIcon`, 흰 아이콘. 누르면 메뉴 화면으로 이동(뎁스 진행)                                      |

- 폭: `<header>`는 부모 폭을 채우고(`w-full`) 최소 240px입니다. 모바일 알약은 Figma 375px 화면의 335px을 비율로 옮긴 폭의 89.3333%(`w-[89.3333%]`, 가운데)이고(375px이면 335px, 320px이면 약 286px) 로고 칸이 남는 폭을 차지합니다(`flex-1`). 240px은 로고·로그인·햄버거가 겹치지 않는 폭이고, 앱 화면은 320px부터 지원합니다.

## 접근성

- `<header>` 안의 `<nav aria-label="주요 메뉴">`. 메뉴는 `<ul>` 목록이고, 현재 위치는 `aria-current="page"`입니다.
- 모바일에서 메뉴 목록은 `display: none`이라 스크린리더·키보드에서 빠집니다. 햄버거는 이름 `menuLabel`을 가집니다.
- 어두운 바탕 위라 포커스 테두리는 흰색(`outline-fill-white`)입니다.
- 가려진 상태(`hideOnScroll`)에서도 포커스가 안으로 들어오면(`focus-within`) 다시 보입니다. 움직임 줄이기 설정이면 전환 애니메이션이 없습니다.

## 라우팅

- core는 `next/*`를 import하지 않습니다. 모든 링크(로고·메뉴·로그인·프로필·햄버거)를 `linkComponent`로 그립니다. 생략하면 `<a>`입니다.
- **Next.js**: `linkComponent={Link}` + `usePathname()`으로 `active` 계산(이 파일은 클라이언트 컴포넌트가 됩니다). 서버 컴포넌트 레이아웃에서 `active` 없이 쓰려면 메뉴를 클라이언트 래퍼로 감쌉니다.
- **React 라우터**: 그 라우터의 `Link`를 `linkComponent`로 넘기고 현재 주소로 `active`를 계산합니다.
- 로그인이 이동이면 `loginHref`, 모달이면 `onLoginClick`만 씁니다(`Button`이 링크가 되지 못해 Header가 같은 모양의 링크를 직접 그립니다).

## 사용 규칙

- 권장: 현재 위치 메뉴만 `active`(흰 글자). 스크롤을 내리면 가려지고 올리면 보이게 둡니다(sticky).
- 금지: Desktop과 Mobile을 한 화면에서 같이 쓰기, 메뉴 7개 이상, `active`를 여럿에 주기.
- 위치는 `sticky top-0`이라 부모가 스크롤 영역이어야 하고 `z-40`입니다. 바깥 칸은 클릭을 가로채지 않습니다(알약만 누를 수 있음).

## Props 요약

`logo`(필수) · `logoHref`("/") · `logoLabel`("홈") · `items`(필수) · `user`("guest") · `loginLabel`·`loginHref`·`onLoginClick` · `profile` · `menuHref`·`onMenuClick`·`menuLabel`("메뉴") · `linkComponent` · `hideOnScroll`(true) · `className`.

## 개발 메모(Figma에 없어서 코드에서 더한 것, 2026-11)

- Desktop·Mobile을 하나의 컴포넌트로 합쳤습니다(Figma는 둘). 경계는 `tablet:`(768px)입니다. Figma는 구간을 정하지 않았고, 폰 가로 화면은 태블릿으로 본다는 저장소 규칙을 따라 이곳부터 펼칩니다. 태블릿 여백은 20입니다(Figma는 데스크톱 64·모바일만 있음). 모바일 알약 폭은 고정 여백이 아니라 시안 375px 기준 비율(335 ÷ 375)입니다.
- `hideOnScroll`·`focus-within`·`REVEAL_ZONE`(80px)·`SCROLL_THRESHOLD`(8px)은 가이드라인의 "스크롤을 내리면 가려지고 올리면 보임"을 구현한 값입니다.
- 메뉴 항목의 올림(Pressed) 모양은 시안에 글자색 변화만 있어 `TextButton inverse`도 글자색만 바뀝니다.
- 알림 점은 Figma `Avatar Push Badge`(Dot, 8px)를 Header 안에서 직접 그립니다. core `Avatar`의 `badge`는 크기 체계가 달라(40 아바타에 16px) 쓰지 않습니다.
