// 스타일은 여기서 import하지 않는다. 사용하는 쪽이 앱 최상단(Next.js는 app/layout.tsx)에서
// `@futurewiz-rms/mint/style.css`를 한 번 불러온다. JS가 CSS를 import하면 서버 컴포넌트에서 쓸 때 문제가 생긴다.

export * from "./utils/cn";

export * from "./components/button/Button";

export * from "./components/grid/Grid";
export * from "./components/icon/Icon";
export * from "./components/icon/icons.generated";
export * from "./components/icon/iconCatalog.generated";
