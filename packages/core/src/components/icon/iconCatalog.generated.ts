// 자동 생성: node scripts/generate-icons.mjs — 직접 고치지 않는다.
// Figma 가이드의 분류와 아이콘 이름. 이름은 kebab-case이고, 컴포넌트 이름은 `<PascalCase>Icon`이다(arrow-left → ArrowLeftIcon).
export const iconCatalog = [
  {
    "category": "방향, 이동",
    "icons": [
      "arrow-left",
      "arrow-right",
      "arrow-up",
      "arrow-down",
      "arrow-up-right",
      "caret-left",
      "caret-right",
      "caret-up",
      "caret-down"
    ]
  },
  {
    "category": "기본 동작",
    "icons": [
      "x",
      "list",
      "dots-three",
      "plus",
      "minus",
      "check",
      "magnifying-glass",
      "funnel",
      "sliders-horizontal",
      "pencil-simple",
      "trash",
      "copy",
      "share-network",
      "download-simple",
      "upload-simple",
      "arrows-clockwise",
      "link"
    ]
  },
  {
    "category": "상태, 알림",
    "icons": [
      "bell",
      "info",
      "warning",
      "warning-circle",
      "check-circle",
      "x-circle",
      "question",
      "lock",
      "eye",
      "eye-slash"
    ]
  },
  {
    "category": "사용자, 일반",
    "icons": [
      "house",
      "user",
      "users",
      "gear",
      "star",
      "heart",
      "bookmark-simple",
      "calendar-blank",
      "clock",
      "chat-circle",
      "envelope",
      "phone"
    ]
  },
  {
    "category": "데이터, 금융",
    "icons": [
      "chart-line",
      "chart-bar",
      "wallet",
      "coins",
      "trend-up",
      "trend-down",
      "receipt",
      "bank"
    ]
  },
  {
    "category": "파일, 기타",
    "icons": [
      "file",
      "folder",
      "image",
      "paperclip",
      "globe"
    ]
  },
  {
    "category": "위치, 지도",
    "icons": [
      "map-pin",
      "map-trifold",
      "navigation-arrow",
      "compass",
      "crosshair",
      "buildings",
      "house-line"
    ]
  },
  {
    "category": "메시지, 소셜",
    "icons": [
      "paper-plane-tilt",
      "chat-text",
      "megaphone",
      "smiley",
      "thumbs-up",
      "at",
      "hash",
      "share-fat"
    ]
  },
  {
    "category": "미디어",
    "icons": [
      "play",
      "pause",
      "speaker-high",
      "speaker-slash",
      "microphone",
      "microphone-slash",
      "camera",
      "video-camera",
      "music-note",
      "headphones"
    ]
  },
  {
    "category": "금융",
    "icons": [
      "currency-krw",
      "currency-btc",
      "arrows-left-right",
      "swap",
      "money",
      "piggy-bank",
      "hand-coins",
      "calculator",
      "vault",
      "scales",
      "chart-line-up",
      "chart-donut",
      "currency-circle-dollar",
      "coin-vertical"
    ]
  },
  {
    "category": "채팅",
    "icons": [
      "chat",
      "chat-dots",
      "chat-centered",
      "chat-centered-text",
      "chat-circle-dots",
      "chat-circle-text",
      "chat-teardrop",
      "chat-teardrop-dots",
      "chat-teardrop-text",
      "chat-slash",
      "chat-circle-slash",
      "chat-centered-slash"
    ]
  },
  {
    "category": "쇼핑, 결제",
    "icons": [
      "shopping-cart",
      "shopping-bag",
      "tag",
      "credit-card",
      "gift",
      "percent",
      "storefront",
      "ticket"
    ]
  },
  {
    "category": "계정, 보안",
    "icons": [
      "user-circle",
      "user-plus",
      "sign-in",
      "sign-out",
      "shield-check",
      "key",
      "fingerprint",
      "identification-card"
    ]
  },
  {
    "category": "기기, 연결",
    "icons": [
      "wifi-high",
      "wifi-slash",
      "device-mobile",
      "desktop",
      "qr-code",
      "cloud",
      "printer",
      "cloud-arrow-up"
    ]
  },
  {
    "category": "동작, 보기",
    "icons": [
      "arrow-counter-clockwise",
      "arrow-clockwise",
      "arrows-out-simple",
      "arrows-in-simple",
      "sort-ascending",
      "sort-descending",
      "dots-three-vertical",
      "list-bullets",
      "squares-four",
      "flag",
      "faders",
      "list-checks",
      "trash-simple",
      "push-pin"
    ]
  },
  {
    "category": "알림, 시간",
    "icons": [
      "bell-ringing",
      "bell-slash",
      "timer",
      "hourglass",
      "calendar-check",
      "alarm",
      "clock-counter-clockwise"
    ]
  },
  {
    "category": "문서, 편집",
    "icons": [
      "file-text",
      "clipboard",
      "note-pencil",
      "archive",
      "folder-open",
      "table",
      "translate"
    ]
  },
  {
    "category": "상태, 기타",
    "icons": [
      "seal-check",
      "prohibit",
      "lightbulb",
      "lightning",
      "sun",
      "moon",
      "fire-simple",
      "trophy",
      "sparkle",
      "thumbs-down",
      "target",
      "rocket-launch",
      "siren"
    ]
  },
  {
    "category": "그 외",
    "icons": [
      "cursor",
      "hand-pointing",
      "robot",
      "text-aa",
      "microphone-stage",
      "briefcase"
    ]
  }
] as const;

export type IconName = (typeof iconCatalog)[number]["icons"][number];
