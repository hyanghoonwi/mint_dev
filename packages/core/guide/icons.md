# 아이콘

> 색인: [`../AGENTS.md`](../AGENTS.md)

Phosphor Icons 기반 아이콘 183개입니다. **아이콘마다 컴포넌트가 하나씩** 있고, 쓰는 것만 번들에 들어갑니다. 서버 컴포넌트에서도 그대로 쓸 수 있습니다(`"use client"` 없음).

```tsx
import { ArrowLeftIcon, HouseIcon } from "@futurewiz-rms/mint";

<ArrowLeftIcon />                        // 24px 선(기본)
<HouseIcon size={20} variant="fill" />   // 20px 채움
```

- **`Icon` 하나에 `name`을 넘기는 방식은 없습니다.** 아이콘을 쓰려면 이름에 맞는 컴포넌트를 import합니다. `<svg>`를 직접 그리지 않습니다.
- **이름 규칙**: 아래 목록의 이름(kebab-case)을 PascalCase로 바꾸고 `Icon`을 붙입니다. `arrow-left` → `ArrowLeftIcon`, `magnifying-glass` → `MagnifyingGlassIcon`, `x` → `XIcon`.
- **`size`**: `16` · `20` · `24`(기본 `24`)만 됩니다. `size`는 컨트롤 크기(`sm|md|lg|xl`)와 달리 아이콘만 숫자입니다.
- **`variant`**: `"line"`(선, 기본) · `"fill"`(채움).
- **색**: 글자색을 따라갑니다. 글자색 토큰 클래스로 지정합니다(`className="text-brand-error"`). hex를 쓰지 않습니다.
- **접근성**: 기본은 장식용(`aria-hidden`)입니다. 아이콘만으로 뜻을 전하는 곳에는 `aria-label="검색"`을 줍니다.
- **`Button` 안**: `leftAddon={<PlusIcon />}`처럼 넣으면 버튼 크기에 맞게 크기가 자동으로 조절됩니다.
- 없는 아이콘은 만들지 않습니다. 필요하면 Figma `Icon / Components`에 먼저 추가를 요청합니다.

## 아이콘 목록 (분류별)

- **방향, 이동**: `arrow-left` · `arrow-right` · `arrow-up` · `arrow-down` · `arrow-up-right` · `caret-left` · `caret-right` · `caret-up` · `caret-down`
- **기본 동작**: `x` · `list` · `dots-three` · `plus` · `minus` · `check` · `magnifying-glass` · `funnel` · `sliders-horizontal` · `pencil-simple` · `trash` · `copy` · `share-network` · `download-simple` · `upload-simple` · `arrows-clockwise` · `link`
- **상태, 알림**: `bell` · `info` · `warning` · `warning-circle` · `check-circle` · `x-circle` · `question` · `lock` · `eye` · `eye-slash`
- **사용자, 일반**: `house` · `user` · `users` · `gear` · `star` · `heart` · `bookmark-simple` · `calendar-blank` · `clock` · `chat-circle` · `envelope` · `phone`
- **데이터, 금융**: `chart-line` · `chart-bar` · `wallet` · `coins` · `trend-up` · `trend-down` · `receipt` · `bank`
- **파일, 기타**: `file` · `folder` · `image` · `paperclip` · `globe`
- **위치, 지도**: `map-pin` · `map-trifold` · `navigation-arrow` · `compass` · `crosshair` · `buildings` · `house-line`
- **메시지, 소셜**: `paper-plane-tilt` · `chat-text` · `megaphone` · `smiley` · `thumbs-up` · `at` · `hash` · `share-fat`
- **미디어**: `play` · `pause` · `speaker-high` · `speaker-slash` · `microphone` · `microphone-slash` · `camera` · `video-camera` · `music-note` · `headphones`
- **금융**: `currency-krw` · `currency-btc` · `arrows-left-right` · `swap` · `money` · `piggy-bank` · `hand-coins` · `calculator` · `vault` · `scales` · `chart-line-up` · `chart-donut` · `currency-circle-dollar` · `coin-vertical`
- **채팅**: `chat` · `chat-dots` · `chat-centered` · `chat-centered-text` · `chat-circle-dots` · `chat-circle-text` · `chat-teardrop` · `chat-teardrop-dots` · `chat-teardrop-text` · `chat-slash` · `chat-circle-slash` · `chat-centered-slash`
- **쇼핑, 결제**: `shopping-cart` · `shopping-bag` · `tag` · `credit-card` · `gift` · `percent` · `storefront` · `ticket`
- **계정, 보안**: `user-circle` · `user-plus` · `sign-in` · `sign-out` · `shield-check` · `key` · `fingerprint` · `identification-card`
- **기기, 연결**: `wifi-high` · `wifi-slash` · `device-mobile` · `desktop` · `qr-code` · `cloud` · `printer` · `cloud-arrow-up`
- **동작, 보기**: `arrow-counter-clockwise` · `arrow-clockwise` · `arrows-out-simple` · `arrows-in-simple` · `sort-ascending` · `sort-descending` · `dots-three-vertical` · `list-bullets` · `squares-four` · `flag` · `faders` · `list-checks` · `trash-simple` · `push-pin`
- **알림, 시간**: `bell-ringing` · `bell-slash` · `timer` · `hourglass` · `calendar-check` · `alarm` · `clock-counter-clockwise`
- **문서, 편집**: `file-text` · `clipboard` · `note-pencil` · `archive` · `folder-open` · `table` · `translate`
- **상태, 기타**: `seal-check` · `prohibit` · `lightbulb` · `lightning` · `sun` · `moon` · `fire-simple` · `trophy` · `sparkle` · `thumbs-down` · `target` · `rocket-launch` · `siren`
- **그 외**: `cursor` · `hand-pointing` · `robot` · `text-aa` · `microphone-stage` · `briefcase`
