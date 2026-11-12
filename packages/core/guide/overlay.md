# 오버레이

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Alert`** — **`useOverlay`로 여는 것을 권장합니다**(아래 `useOverlay`). 꼭 확인하고 넘어가야 하는 상황에 쓰는 대화상자. 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onClick`·`onClose`는 클라이언트 컴포넌트에서 넘깁니다).
  - `open`(필수): 열림 여부. 상태는 사용하는 쪽이 `useState`로 갖습니다
  - `onClose`: Esc를 눌렀을 때 호출됩니다. 여기서 `open`을 `false`로 바꿉니다
  - `heading`·`body`는 `ReactNode`라서 줄바꿈·강조를 넣을 수 있습니다. 버튼·입력창 같은 조작 요소는 본문에 넣지 않습니다
  - `heading`: 한 줄 제목. 생략하면 제목 줄이 없습니다
  - `body`(필수): 본문(해결 방법). `children`은 받지 않으므로 `<Alert ... />`처럼 자식 없이 씁니다
  - `action`(필수): 하단 버튼 영역에 들어갈 `ReactNode`. `Button`을 1~2개 직접 넣어 조합합니다(오른쪽 끝 정렬, 간격 8). 취소 같은 보조 행동은 `color="secondary"`로 앞에, 주된 행동은 뒤에 둡니다. 위험한 일은 주된 버튼을 `color="destructive"`로 합니다. 버튼 이름은 "삭제"·"취소"처럼 행동을 그대로 씁니다. 닫는 것은 각 버튼의 `onClick`에서 `open`을 바꿔서 합니다
  - 정보만 알리는 일에는 쓰지 않습니다(Toast·Snackbar). 같은 일을 하는 버튼을 두 개 두지 않습니다
- **`OverlayProvider`** — `useOverlay`로 연 오버레이를 그리는 자리. 앱 최상단(`app/layout.tsx`)을 한 번 감쌉니다(`<OverlayProvider>{children}</OverlayProvider>`). `"use client"`가 달려 있어 서버 레이아웃에서 바로 import해도 됩니다. Provider가 사라지면 기다리던 `openAsync`는 `undefined`로 끝납니다.
- **`useOverlay`** — Alert 같은 오버레이를 함수 안에서 엽니다(FDS `useOverlay`와 같은 API). 클라이언트 컴포넌트에서 씁니다. `OverlayProvider` 밖에서 쓰면 오류를 던집니다. 앱 전체가 같은 API를 쓰므로 어느 컴포넌트에서 연 것이든 id로 닫을 수 있습니다.
  - `overlay.open(render, options?)`(id 반환), `overlay.openAsync<T>(render, options?)`(닫을 때 `close(value)`의 값을 `Promise`로 반환, 값 없이 닫히거나 `exit`·`closeAll`로 닫히면 `undefined`), `overlay.close(id)`, `overlay.exit(id)`(즉시 제거), `overlay.closeAll()`
  - `render`는 `({ isOpen, close, overlayId, exit }) => 노드`. Alert의 `open`에 `isOpen`, `onClose`에 `close`를 연결합니다. 버튼에는 `onClick={() => close()}`처럼 감싸서 넘깁니다(이벤트가 값으로 넘어가지 않게)
  - `options`: `overlayId`(같은 id가 이미 열려 있으면 새로 열지 않음 → 중복 열림 방지. `openAsync`는 진행 중인 Promise를 그대로 돌려줌), `exitDelay`(닫은 뒤 제거까지 ms, 기본 0)
  - `render`는 **열 때의 값**을 캡처합니다. 오버레이 안에 바뀌는 상태가 필요하면 상태를 가진 컴포넌트를 반환하세요
  - 쌓기: 열린 Alert 위에서 다시 `open`하면 위에 쌓입니다. Esc는 맨 위 하나만 닫고, 스크롤 잠금은 마지막 Alert가 닫힐 때 풀립니다. 두 겹까지만 권장합니다
  - 결과 받기 예: `const ok = await overlay.openAsync<boolean>(({ isOpen, close }) => <Alert open={isOpen} onClose={() => close(false)} … action={<Button onClick={() => close(true)}>삭제</Button>} />)`

- **`Toast`** — 사용자 행동의 결과를 짧게 알리는 메시지의 모양(Figma `Toast`). 서버 컴포넌트에서도 그릴 수 있지만, 화면에 띄울 때는 `useToast`를 씁니다. 상세 규칙은 `components/toast/AGENTS.md`
  - `variant`: `normal`(기본) · `positive`(완료) · `cautionary`(주의) · `negative`(오류). 종류에 맞는 아이콘이 항상 앞에 붙습니다(켜고 끄는 prop 없음)
  - `shape`: `default`(모서리 12, 기본) · `pill`(알약). `children`: 메시지 한 문장
- **`ToastProvider`** — `useToast`로 띄운 토스트와 `useSnackbar`로 띄운 스낵바를 그리는 자리(둘은 띄운 순서대로 한 자리에 섞여 쌓이고 `limit`도 함께 셈). 앱 최상단(`app/layout.tsx`)을 한 번 감쌉니다. `"use client"`라 서버 레이아웃에서 바로 import해도 됩니다
  - `position`: `bottom`(기본, 아래 가운데) · `top`(위 가운데). 새 토스트가 화면 가장자리 쪽에 붙습니다
  - `offset`: 가장자리에서 띄우는 거리(px, 기본 20). 하단 고정 버튼·탭 바·헤더를 가리지 않게 늘립니다(안전 영역은 자동으로 더함)
  - `limit`(기본 3, 넘치면 오래된 것부터 사라짐) · `duration`(토스트 기본 시간, 기본 3000ms, 가이드 2~4초) · `snackbarDuration`(스낵바 기본 시간, 기본 5000ms) · `shape`(기본 모양)
- **`useToast`** — 토스트를 함수 호출로 띄웁니다(FDS `useToast`와 같은 구조). 클라이언트 컴포넌트에서 씁니다. `ToastProvider` 밖에서 쓰면 오류를 던집니다
  - `toast(message, options?)`(id 반환) · `toast.normal` · `toast.positive` · `toast.cautionary` · `toast.negative` · `toast.dismiss(id?)`(생략하면 모두)
  - `options`: `id`(같은 id가 떠 있으면 새로 쌓지 않고 내용·시간을 새로 고침) · `variant` · `shape` · `duration`(`null`이면 닫을 때까지) · `onClose`
  - 마우스를 올리거나 포커스가 있는 동안 멈춥니다. negative는 `role="alert"`, 나머지는 `role="status"`
  - 버튼이 필요한 안내(`useSnackbar`)나 꼭 읽어야 하는 안내(Alert)에는 쓰지 않습니다
- **`useSnackbar`** — 다음 행동 버튼이 있는 스낵바를 함수 호출로 띄웁니다. `useToast`와 **같은 `ToastProvider`**를 쓰고(따로 Provider 없음), 토스트와 같은 자리에 섞여 쌓입니다. 클라이언트 컴포넌트에서 씁니다. Provider 밖에서 쓰면 오류를 던집니다
  - `snackbar(heading, options?)`(id 반환) · `snackbar.normal` · `.positive` · `.cautionary` · `.negative` · `snackbar.dismiss(id?)`(생략하면 스낵바만 모두, 토스트는 그대로)
  - `options`: `action`(`{ label, onClick }`, 누르면 `onClick` 뒤 스낵바가 닫힘) · `description` · `icon` · `closable`(닫기 버튼) · `variant` · `duration`(`null`이면 닫을 때까지) · `id` · `onClose`
  - 폭 420(좁은 화면은 좌우 20을 뺀 폭), 떠 있어서 `shadow-floating`. 본문에 늘 두는 안내는 `Snackbar` 컴포넌트를 그대로 렌더링합니다

- **`Tooltip`** — 버튼에 마우스를 올리거나 포커스했을 때 짧은 보조 정보(이름·단축키)를 보여 주는 말풍선(Figma `Tooltip`). 클라이언트 컴포넌트지만 서버 컴포넌트에서 import해도 됩니다(열림 상태를 안에서 관리). 상세 규칙은 `components/tooltip/AGENTS.md`
  - `label`(필수): 말풍선 글자. 한 줄로 짧게. 단축키는 이름 대신 `"⌘C"`처럼 단축키 글자만 넣습니다
  - `children`(필수): 대상 요소 하나(포커스를 받을 수 있는 `Button`·`IconButton`·링크). `aria-describedby`가 자동으로 붙습니다. 아이콘 버튼은 `aria-label`도 따로 붙입니다
  - `position`: `top`(기본) · `bottom` · `left` · `right`. 화면 가장자리에서 자동으로 뒤집히지 않으니 잘 보이는 쪽을 고릅니다. 구간별 객체도 받음(`{ base: "bottom", desktop: "right" }`, 화살표 방향도 따라감)
  - `arrowAlign`: `center`(기본) · `start` · `end`(위·아래면 왼쪽·오른쪽, 왼쪽·오른쪽이면 위·아래). 화살표 끝이 대상 가운데를 가리킵니다
  - 말풍선 그림자는 `shadow-floating`(토스트·메뉴·툴팁 같은 떠 있는 요소 공통)입니다
  - `size`: `sm` 30 · `md` 36(기본) · `lg` 42px. 구간별 객체도 받음(`{ base: "sm", desktop: "md" }`)
  - `open`·`onOpenChange`: 직접 제어할 때. 생략하면 hover(마우스)·포커스에서 열리고 벗어나거나 Esc로 닫힙니다
  - 안에 링크·버튼을 넣지 않고, 꼭 읽어야 하는 안내를 Tooltip에만 두지 않습니다(터치 화면에는 hover가 없음). `overflow: hidden` 영역 안에서는 잘릴 수 있습니다
