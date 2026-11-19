import type { ReactNode } from "react";
import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { OverlayProvider } from "@futurewiz-rms/mint";
import { NavLinks } from "../../components/NavLinks";
import { SearchModal } from "../../components/SearchModal";

const navbar = (
  <Navbar
    logo={<span style={{ fontSize: 16, fontWeight: 700 }}>CryptoLabs Design System</span>}
    logoLink="/"
  >
    <NavLinks />
    <SearchModal />
  </Navbar>
);

export default async function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <Layout
      navbar={navbar}
      footer={null}
      pageMap={await getPageMap()}
      docsRepositoryBase="https://github.com/futurewiz-rms/cryptolabs-design-system/blob/main/packages/docs"
      editLink={null}
      feedback={{ content: null }}
      darkMode={false}
      // 라이트 화면만 있다(다크 모드 없음)
      nextThemes={{ defaultTheme: "light", forcedTheme: "light" }}
      sidebar={{ defaultMenuCollapseLevel: 99, toggleButton: false }}
      toc={{ title: "On this page", backToTop: null }}
      copyPageButton={false}
      // 기본 검색창 대신 헤더의 돋보기 버튼 → 검색 모달(SearchModal)을 쓴다
      search={null}
    >
      {/* useOverlay 예시가 열 오버레이를 그릴 자리(사용하는 쪽 앱도 app/layout.tsx에 한 번 둔다) */}
      <OverlayProvider>{children}</OverlayProvider>
    </Layout>
  );
}
