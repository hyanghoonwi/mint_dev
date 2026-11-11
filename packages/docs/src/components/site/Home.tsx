import Link from "next/link";
import { DocsFooter } from "./Landing";

// 첫 화면(/). Montage 첫 화면과 같은 틀: 히어로 → 흐르는 띠 → 시작 카드 → 원칙 → FAQ → 푸터.
// 흐르는 띠에는 화면 캡처 대신 실제 MINT 컴포넌트를 그린다(문서에 없는 API를 쓰지 않는다).

// 흐르는 띠의 칸 폭. 그림이 정해질 때까지 빈 칸으로 둔다(Figma: 144px 정사각형, 두 번째 줄 일부는 224px)
const rows = [
  [144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144],
  [144, 144, 144, 144, 144, 224, 144, 144, 144, 224],
];

const starts = [
  {
    title: "설치하고 시작하기",
    description: "패키지를 설치하고 첫 화면을 만들어요",
    meta: "Getting started",
    to: "/getting-started/installation",
  },
  {
    title: "파운데이션 둘러보기",
    description: "컬러, 타이포그래피, 간격, 아이콘",
    meta: "Foundations",
    to: "/foundations/overview",
  },
  {
    title: "컴포넌트 살펴보기",
    description: "버튼, 입력, 목록처럼 화면을 이루는 단위",
    meta: "Components",
    to: "/components/overview",
  },
];

const principles = [
  {
    title: "숫자가 먼저 읽힌다",
    description: "가격과 변동률은 화면에서 가장 높은 대비로, 자리가 흔들리지 않게 표시합니다.",
  },
  {
    title: "색만으로 구분하지 않는다",
    description: "상태는 색과 함께 글자나 기호로도 알려서 누구나 같은 정보를 받습니다.",
  },
  {
    title: "모바일웹과 PC가 같은 컴포넌트",
    description: "같은 컴포넌트를 쓰고 화면 폭에 따라 배치만 바꿉니다.",
  },
];

const faqs = [
  {
    q: "누가 쓸 수 있나요?",
    a: "MINT는 사내 패키지(GitHub Packages)로 배포합니다. 패키지 읽기 권한이 있는 GitHub 계정으로 설치할 수 있어요.",
  },
  {
    q: "Next.js 서버 컴포넌트에서 쓸 수 있나요?",
    a: '네. 상태가 필요한 컴포넌트에는 라이브러리가 "use client"를 달아 두어서 서버 컴포넌트에서 바로 import해도 됩니다. onClick처럼 함수를 넘기는 부분만 클라이언트 컴포넌트에서 씁니다.',
  },
  {
    q: "Tailwind 설정이 필요한가요?",
    a: "아니요. 앱 최상단에서 style.css를 한 번 불러오면 색, 글자, 간격 클래스가 모두 들어 있어요.",
  },
  {
    q: "컴포넌트 모양을 바꿔도 되나요?",
    a: "className으로 덮어쓸 수는 있지만, 모양을 바꿔야 한다면 먼저 Figma에서 디자인을 정하고 MINT에 반영해 주세요. 같은 화면 언어를 유지하기 위해서예요.",
  },
  {
    q: "새 버전에서 무엇이 바뀌었는지 어디서 보나요?",
    a: "변경 이력 페이지에서 버전별로 확인할 수 있어요. 바꿔야 하는 코드가 있으면 업그레이드 방법도 함께 적어 둡니다.",
  },
];

export function Home() {
  return (
    <div className="docs-home">
      <section className="docs-home__hero">
        <h1 className="docs-home__title">
          Mint to Coin,
          <br />
          Coin to CryptoLab
        </h1>
        <p className="docs-home__lead">
          MINT는 크립토랩의 모든 화면을 같은 언어로 만들기 위한 디자인 시스템입니다. 같은 틀로
          코인을 찍어 내는 조폐소처럼, 같은 컴포넌트로 화면을 만듭니다.
        </p>
        <Link className="docs-home__cta" href="/getting-started">
          Getting Started
        </Link>
      </section>

      {/* 흐르는 띠: 같은 줄을 두 벌 이어 붙여 끊김 없이 돈다. 두 번째 줄은 반대 방향. 장식이라 읽지 않는다 */}
      <div className="docs-home__marquee" aria-hidden="true" data-pagefind-ignore>
        {rows.map((widths, row) => (
          <div key={row} className="docs-home__track" data-reverse={row === 1 || undefined}>
            {[0, 1].map((copy) => (
              <div key={copy} className="docs-home__set">
                {widths.map((width, index) => (
                  <span key={index} className="docs-home__tile" style={{ width }} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <section className="docs-home__section">
        <h2 className="docs-home__heading">Start Your MINT</h2>
        <div className="docs-home__cards">
          {starts.map((item) => (
            <Link key={item.to} href={item.to} className="docs-home__card">
              <span className="docs-home__card-meta">{item.meta}</span>
              <strong className="docs-home__card-title">{item.title}</strong>
              <span className="docs-home__card-desc">{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="docs-home__section">
        <h2 className="docs-home__heading">Behind the System</h2>
        <div className="docs-home__cards">
          {principles.map((item) => (
            <div key={item.title} className="docs-home__card docs-home__card--static">
              <strong className="docs-home__card-title">{item.title}</strong>
              <span className="docs-home__card-desc">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-home__section">
        <h2 className="docs-home__heading">FAQ</h2>
        <div className="docs-home__faq">
          {faqs.map((item) => (
            <details key={item.q} className="docs-home__faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <DocsFooter />
    </div>
  );
}
