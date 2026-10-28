---
slug: /intro
sidebar_position: 1
---

# 소개

MINT는 크립토랩 서비스를 위한 디자인 시스템입니다. Next.js(App Router) 반응형 사이트에서 쓰는 React 컴포넌트와 디자인 토큰을 제공합니다. React 19, TypeScript, Tailwind CSS 4 기반입니다.

> **Mint to Coin, Coin to CryptoLab.** 디자인 시스템은 같은 틀로 코인을 찍어 내는 조폐소(Mint)이고, 컴포넌트는 그 틀로 찍어 낸 코인이며, 코인이 모여 크립토랩이 됩니다.

## 패키지

| 패키지                | 역할                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------- |
| `@futurewiz-rms/mint` | 배포되는 라이브러리. 컴포넌트와 디자인 토큰이 들어 있습니다.                            |
| `@mint/storybook`     | 컴포넌트를 만들며 확인하는 개발용 공간. prop과 화면 폭을 바꿔 보고 접근성을 점검합니다. |
| `@mint/docs`          | 지금 보고 있는 사용 가이드. 실제 `@futurewiz-rms/mint` 컴포넌트로 예시를 보여 줍니다.   |

## 설치

private 패키지(GitHub Packages)입니다. 프로젝트 루트의 `.npmrc`에 아래를 넣습니다.

```
@futurewiz-rms:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

```bash
npm install @futurewiz-rms/mint
```

`app/layout.tsx`에서 스타일을 한 번 불러오고, 컴포넌트를 가져와 씁니다. 서버 컴포넌트에서도 바로 import할 수 있습니다.

```tsx
// app/layout.tsx
import "@futurewiz-rms/mint/style.css";
```

```tsx
// app/page.tsx
import { Button } from "@futurewiz-rms/mint";

export default function Page() {
  return <Button>시세 보기</Button>;
}
```

`style.css`에는 Tailwind 리셋(preflight)이 들어 있습니다. 자체 리셋이 있는 앱에서는 `@futurewiz-rms/mint/style.no-reset.css`를 대신 불러오세요.

## 컴포넌트

- [Button](./components/common/button)
- [Container · Grid](./components/common/grid)
- [Icon](./components/common/icon)
