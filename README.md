# MINT Design System

> Mint to Coin, Coin to CryptoLab

크립토랩 서비스의 Next.js(App Router) 반응형 사이트를 위한 디자인 시스템입니다. React 19, TypeScript, Tailwind CSS 4 기반입니다.

| 패키지                                       | 역할                             |
| -------------------------------------------- | -------------------------------- |
| [`packages/core`](./packages/core)           | `@futurewiz-rms/mint` 라이브러리 |
| [`packages/storybook`](./packages/storybook) | 개발용 Storybook                 |
| [`packages/docs`](./packages/docs)           | Docusaurus 문서 사이트           |

```bash
npm install
npm run storybook   # http://localhost:6006
npm run docs        # http://localhost:3000
npm run build       # core 빌드
```

작업 규칙은 [`AGENTS.md`](./AGENTS.md)를 봅니다.
