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
