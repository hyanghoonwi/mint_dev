import type { ReactNode } from "react";
import Script from "next/script";
import { Head } from "nextra/components";
import "nextra-theme-docs/style.css";
import "@futurewiz-rms/mint/style.no-reset.css";
import "./docs.css";

export const metadata = {
  // 탭 제목: 첫 화면은 "CryptoLab Design System", 나머지는 "{페이지 제목} - CryptoLab Design System"
  title: { default: "CryptoLab Design System", template: "%s - CryptoLab Design System" },
  description: "크립토랩의 모든 화면을 같은 언어로",
  icons: { icon: "/img/mint-symbol.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head
        color={{ hue: 0, saturation: 0, lightness: { light: 10, dark: 96 } }}
        backgroundColor={{ light: "#ffffff", dark: "#0f0f10" }}
      />
      <body>
        {/*
          Nextra 테마는 <html class="dark">로 다크를 구분하고, MINT 컴포넌트는 <html data-theme="dark">를 읽는다.
          (Nextra의 nextThemes.attribute는 배열을 줘도 검증에서 오류가 나서 둘을 동시에 쓸 수 없다.)
          class가 바뀔 때마다 data-theme을 따라 바꿔서 두 쪽을 맞춘다. 첫 화면이 그려지기 전에 실행해야 깜빡이지 않는다.
          인트로(/)와 문서 모두에 필요해서 루트 레이아웃에 둔다.
        */}
        <Script id="theme-bridge" strategy="beforeInteractive">
          {`(function(){var r=document.documentElement;function s(){r.setAttribute("data-theme",r.classList.contains("dark")?"dark":"light")}s();new MutationObserver(s).observe(r,{attributes:true,attributeFilter:["class"]})})()`}
        </Script>
        {children}
      </body>
    </html>
  );
}
