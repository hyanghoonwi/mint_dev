import type { ReactNode } from "react";
import Link from "next/link";

/** 소개 페이지의 첫 화면(시안의 히어로 카드) */
export function Hero() {
  return (
    <section className="docs-hero">
      {/* 밝은 배경용(white)과 어두운 배경용(ink) 심볼을 테마에 맞게 보여 준다 */}
      <img
        className="docs-hero__symbol docs-only-light"
        src="/brand/mint_symbol_white.svg"
        alt=""
        width={64}
        height={64}
      />
      <img
        className="docs-hero__symbol docs-only-dark"
        src="/brand/mint_symbol_ink.svg"
        alt=""
        width={64}
        height={64}
      />
      <h1 className="docs-hero__title">
        크립토랩의 모든 화면을
        <br />
        같은 언어로
      </h1>
      <p className="docs-hero__lead">
        MINT는 한국경제TV 크립토랩의 디자인 시스템입니다. 시세와 차트, 커뮤니티를 만드는 데 필요한
        파운데이션과 컴포넌트를 한곳에서 확인하세요.
      </p>
      <div className="docs-hero__actions">
        <Link className="docs-btn docs-btn--solid" href="/getting-started">
          시작하기
        </Link>
        <Link className="docs-btn docs-btn--outline" href="/components/overview">
          컴포넌트 보기
        </Link>
      </div>
    </section>
  );
}

interface LinkCardItem {
  title: string;
  description: string;
  to: string;
}

/** 번호가 붙은 링크 카드 묶음. 소개의 바로가기, 시작하기의 다음 단계에 쓴다 */
export function LinkCards({
  items,
  numbered = false,
}: {
  items: LinkCardItem[];
  numbered?: boolean;
}) {
  return (
    <div className="docs-cards">
      {items.map((item, index) => (
        <Link key={item.to} className="docs-card" href={item.to}>
          {numbered && <span className="docs-card__num">{String(index + 1).padStart(2, "0")}</span>}
          <span className="docs-card__title">
            {item.title}
            {!numbered && " →"}
          </span>
          <span className="docs-card__desc">{item.description}</span>
        </Link>
      ))}
    </div>
  );
}

/** 원칙 3열: 정사각형 그림 자리 + 가운데 제목·설명 (그림은 정해질 때까지 비워 둔다) */
export function Principles({ items }: { items: { title: string; children: ReactNode }[] }) {
  return (
    <div className="docs-principles">
      {items.map((item) => (
        <div key={item.title} className="docs-principle">
          <div className="docs-principle__figure" aria-hidden="true" />
          <div>
            <strong>{item.title}</strong>
            <p>{item.children}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** 그림 자리: 그림이 정해질 때까지 비워 둔 연회색 칸 */
export function Figure({ height = 260 }: { height?: number }) {
  return <div className="docs-figure" style={{ height }} aria-hidden="true" />;
}

/** 테두리 있는 링크 카드 2열 */
export function LinkButtons({ items }: { items: { title: string; to: string }[] }) {
  return (
    <div className="docs-link-buttons">
      {items.map((item) => (
        <Link key={item.to} href={item.to}>
          {item.title}
        </Link>
      ))}
    </div>
  );
}

/** 이름 | 설명 한 줄 목록. 줄마다 해당 페이지로 이동한다 */
export function ListRows({
  items,
}: {
  items: { name: string; description: string; to: string }[];
}) {
  return (
    <div className="docs-list-rows">
      {items.map((item) => (
        <Link key={item.to} href={item.to}>
          <strong>{item.name}</strong>
          <span>{item.description}</span>
        </Link>
      ))}
    </div>
  );
}

/** 다른 페이지로 가는 링크 카드(예: Foundations에서 해당 컴포넌트 사용법으로). 누를 수 있게 테두리와 화살표를 둔다 */
export function PageLink({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={to} className="docs-page-link">
      <span className="docs-page-link__text">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <span className="docs-page-link__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/** 문서 페이지 아래 푸터: 저작권 + More information(펼치면 링크) */
export function DocsFooter() {
  return (
    <footer className="docs-footer">
      <span>© 2026 MINT Design System</span>
      <details>
        <summary>More information</summary>
        <ul>
          <li>
            <Link href="/getting-started/changelog">Changelog</Link>
          </li>
        </ul>
      </details>
    </footer>
  );
}
