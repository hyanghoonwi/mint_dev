"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BellIcon,
  Button,
  CheckCircleIcon,
  HeartIcon,
  StarIcon,
} from "@futurewiz-rms/mint";
import type { GridLayout, ParticleScene } from "./particles";

/*
 * 인트로: 스크롤로 넘기는 이야기. 점(파티클) 수천 개가 만드는 MINT 로고에서 시작한다.
 *   0~30%   점이 모여 MINT 로고(잎 네 장)가 되고, 바람에 미세하게 물결친다
 *   30~60%  로고가 결속을 잃고 3D 공간으로 흩어진다(카메라가 다가온다)
 *   60~100% 흩어진 점이 직선으로 날아와 UI 컴포넌트 와이어프레임 격자로 정렬되고, 마지막에 실제 컴포넌트 카드가 나타난다
 * 점 장면(three.js)은 particles.ts에 있고, 이 파일은 스크롤 진행도·자막·실제 컴포넌트 카드(DOM)를 맡는다.
 * WebGL을 쓸 수 없으면 점 장면 없이 자막과 카드만 보여 준다.
 */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const chapters = [
  {
    range: [0, 0.14],
    title: "MINT 디자인 시스템,\n모든 화면의 시작입니다",
    sub: "크립토랩의 서비스를 위한 디자인 시스템",
    mid: true,
  },
  {
    range: [0.14, 0.3],
    title: "흩어져 있던 고민들을 모아,\n단 하나의 명확한 기준을 세웁니다.",
    sub: "컬러·타이포그래피·간격·아이콘을 하나의 토큰으로 정의합니다.",
    mid: true,
  },
  {
    range: [0.3, 0.6],
    title: "이 기준은 다시\n무한한 가능성으로 펼쳐져,",
    sub: "토큰은 모든 컴포넌트와 화면을 만드는 재료가 됩니다.",
    mid: true,
  },
  {
    // 점이 와이어프레임을 마치고 실제 컴포넌트로 바뀌는 순간(90%~)에 나온다. 60~90%는 문구 없이 점의 움직임만 보여 준다
    range: [0.9, 1.01],
    title: "마침내, 흔들림 없는\n하나의 시스템을 완성합니다.",
    sub: "컴포넌트는 어느 화면에서나 같은 모양으로 쓰입니다.",
    mid: false,
  },
] as const;

/** 격자 칸 배치. 점 장면의 와이어프레임과 DOM 카드가 같은 값을 쓴다 */
function gridLayout(w: number, h: number): GridLayout {
  const portrait = w < 768;
  const cols = portrait ? 2 : 4;
  const count = portrait ? 10 : 12;
  const rows = count / cols;
  const gridW = portrait ? w * 0.9 : Math.min(w * 0.86, 1080);
  const cellW = gridW / cols;
  const cellH = Math.min(cellW * 0.62, (h * 0.5) / rows);
  return { w, h, cols, rows, cellW, cellH, gap: 12, originY: h * 0.36 };
}

/* 격자 칸 12개에 들어가는 실제 컴포넌트·토큰 */
function cell(i: number): ReactNode {
  switch (i) {
    case 0:
      return (
        <Button size="lg" tabIndex={-1}>
          시작하기
        </Button>
      );
    case 1:
      return (
        <div className="intro-cell__stack">
          <Button color="secondary" tabIndex={-1}>
            Secondary
          </Button>
          <Button variant="outline" tabIndex={-1}>
            Outline
          </Button>
        </div>
      );
    case 2:
      return (
        <div className="intro-cell__text">
          <span className="text-display-1-bold text-text-strong">Aa</span>
          <span className="text-body-2-regular text-text-tertiary">가나다 ABC 123</span>
        </div>
      );
    case 3:
      return (
        <div className="intro-cell__row">
          {["brand", "neutral", "danger", "success", "warning"].map((n) => (
            <span
              key={n}
              className="intro-cell__chip"
              style={{ background: `var(--mint-fill-${n})` }}
            />
          ))}
        </div>
      );
    case 4:
      return (
        <div className="intro-cell__row">
          <HeartIcon size={24} variant="fill" className="text-icon-danger" />
          <StarIcon size={24} variant="fill" className="text-icon-warning" />
          <CheckCircleIcon size={24} variant="fill" className="text-icon-success" />
          <BellIcon size={24} className="text-icon-brand" />
        </div>
      );
    case 5:
      return (
        <div className="intro-cell__text">
          <span className="text-heading-2-bold text-text-strong">text/strong</span>
          <span className="text-body-2-regular text-text-primary">text/primary</span>
          <span className="text-body-3-regular text-text-tertiary">text/tertiary</span>
        </div>
      );
    case 6:
      return (
        <div className="intro-cell__stack">
          <Button color="destructive" tabIndex={-1}>
            Destructive
          </Button>
          <Button disabled tabIndex={-1}>
            Disabled
          </Button>
        </div>
      );
    case 7:
      return (
        <div className="intro-cell__row">
          {[100, 300, 500, 700, 900].map((n) => (
            <span
              key={n}
              className="intro-cell__chip"
              style={{ background: `var(--color-atomic-gray-${n})` }}
            />
          ))}
        </div>
      );
    case 8:
      return (
        <div className="intro-cell__row">
          {["default", "strong", "focus"].map((n) => (
            <span
              key={n}
              className="intro-cell__box"
              style={{ border: `2px solid var(--mint-border-${n})` }}
            />
          ))}
        </div>
      );
    case 9:
      return (
        <div className="intro-cell__row">
          {["default", "lower", "upper"].map((n) => (
            <span
              key={n}
              className="intro-cell__box"
              style={{
                background: `var(--mint-background-${n})`,
                border: "1px solid var(--mint-border-default)",
              }}
            />
          ))}
        </div>
      );
    case 10:
      return (
        <div className="intro-cell__row">
          <Button size="sm" tabIndex={-1}>
            sm
          </Button>
          <Button size="md" tabIndex={-1}>
            md
          </Button>
          <Button size="lg" tabIndex={-1}>
            lg
          </Button>
        </div>
      );
    default:
      return (
        <span className="text-label-1-semibold text-text-brand">
          문서 보기 <ArrowRightIcon size={16} className="inline" />
        </span>
      );
  }
}

/* ───────────── 이야기 무대 ───────────── */

function Story() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const ticks = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const trackEl = track.current;
    const stageEl = stage.current;
    const canvasEl = canvas.current;
    if (!trackEl || !stageEl || !canvasEl) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    let p = 0;
    let scene: ParticleScene | null = null;
    let webglFailed = false;
    let disposed = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // DOM: 자막·진행 눈금·실제 컴포넌트 카드
    const apply = () => {
      const layout = gridLayout(w, h);
      const { cols, rows, cellW, cellH, gap } = layout;
      const count = cols * rows;
      const cs = Math.min(1, cellH / 150, cellW / 230);
      // 와이어프레임이 완성된 뒤(93%~) 실제 카드가 나타난다. WebGL이 없으면 정렬 단계에서 바로 보여 준다
      const cardIn = easeOut(seg(p, webglFailed ? 0.6 : 0.93, webglFailed ? 0.76 : 1));
      for (let i = 0; i < 12; i++) {
        const el = cells.current[i];
        if (!el) continue;
        const gx = ((i % cols) - (cols - 1) / 2) * cellW;
        const gy = (Math.floor(i / cols) - (rows - 1) / 2) * cellH;
        const width = cellW - gap;
        const height = cellH - gap;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.transform = `translate(${gx - width / 2}px, ${gy - height / 2}px)`;
        el.style.opacity = i < count ? String(cardIn) : "0";
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `scale(${cs})`;
      }

      let active = 0;
      chapters.forEach((chapter, i) => {
        const [a, b] = chapter.range;
        const el = captions.current[i];
        if (!el) return;
        const fadeIn = i === 0 ? 1 : seg(p, a + 0.01, a + 0.045);
        const fadeOut = i === chapters.length - 1 ? 0 : seg(p, b - 0.04, b - 0.005);
        const o = fadeIn * (1 - fadeOut);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - fadeIn) * 28 - fadeOut * 16}px)`;
        if (p >= a) active = i;
      });
      ticks.current.forEach((t, i) => t?.classList.toggle("is-on", i === active));
    };

    const update = () => {
      frame = 0;
      const rect = trackEl.getBoundingClientRect();
      p = clamp(-rect.top / (rect.height - window.innerHeight));
      scene?.setProgress(p);
      scene?.setVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      apply();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const rect = stageEl.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      scene?.resize(w, h, gridLayout(w, h));
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);

    // 점 장면: three.js는 여기서 처음 내려받는다
    import("./particles")
      .then(({ createParticleScene }) =>
        createParticleScene(canvasEl, gridLayout(w, h), { reducedMotion: reduced }),
      )
      .then((created) => {
        if (disposed) {
          created.dispose();
          return;
        }
        scene = created;
        schedule();
      })
      .catch(() => {
        webglFailed = true;
        schedule();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      scene?.dispose();
    };
  }, []);

  const goTo = (index: number) => {
    const trackEl = track.current;
    if (!trackEl) return;
    const [a, b] = chapters[index].range;
    const target = Math.min((a + Math.min(b, 1)) / 2 + 0.04, 0.99);
    const top = trackEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + target * (trackEl.offsetHeight - window.innerHeight),
      behavior: "smooth",
    });
  };

  return (
    <div className="intro-track" ref={track}>
      <div className="intro-stage" ref={stage}>
        <canvas ref={canvas} className="intro-canvas" aria-hidden="true" />

        <div className="intro-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="intro-cell"
              ref={(el) => {
                cells.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              <div className="intro-cell__inner">{cell(i)}</div>
            </div>
          ))}
        </div>

        {chapters.map((chapter, i) => (
          <div
            key={chapter.title}
            className={`intro-caption ${chapter.mid ? "is-mid" : ""}`}
            ref={(el) => {
              captions.current[i] = el;
            }}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {i === 0 ? (
              <h1 className="intro-caption__title">{chapter.title}</h1>
            ) : (
              <h2 className="intro-caption__title">{chapter.title}</h2>
            )}
            <p className="intro-caption__sub">{chapter.sub}</p>
          </div>
        ))}

        <Link href="/introduction" className="intro-cta">
          문서 보기 <ArrowRightIcon size={16} />
        </Link>

        <nav className="intro-ticks" aria-label="이야기 단계">
          {chapters.map((chapter, i) => (
            <button
              key={chapter.title}
              type="button"
              aria-label={chapter.title.replace("\n", " ")}
              ref={(el) => {
                ticks.current[i] = el;
              }}
              className={i === 0 ? "is-on" : ""}
              onClick={() => goTo(i)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ───────────── 헤더·마무리·푸터 ───────────── */

function Header() {
  return (
    <header className="intro-header">
      <Link href="/" className="intro-header__logo" aria-label="MINT">
        <img src="/img/mint-logo-dark.svg" alt="MINT" height={22} />
      </Link>
      <nav className="intro-header__nav" aria-label="바로가기">
        <Link href="/foundations/colors">파운데이션</Link>
        <Link href="/components/overview">컴포넌트</Link>
        <Link href="/brand/logo">브랜드</Link>
      </nav>
    </header>
  );
}

const pills = [
  { to: "/getting-started", label: "시작하기", primary: true },
  { to: "/foundations/colors", label: "파운데이션" },
  { to: "/components/overview", label: "컴포넌트" },
  { to: "/brand/logo", label: "브랜드" },
];

/** 마무리: 두 단계 문장과 알약 모양 바로가기 */
function Ending() {
  return (
    <section className="intro-end">
      <p className="intro-end__lead">
        같은 틀로 정렬된 화면이 쌓여
        <br />
        크립토랩의 하루가 됩니다
      </p>
      <h2 className="intro-end__title">
        크립토랩의 모든 화면을
        <br />
        <em>같은 언어로</em>
      </h2>
      <div className="intro-pills">
        {pills.map((pill) => (
          <Link
            key={pill.to}
            href={pill.to}
            className={`intro-pill ${pill.primary ? "is-primary" : ""}`}
          >
            {pill.label} <ArrowRightIcon size={16} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Intro() {
  return (
    <div className="intro">
      <Header />
      <main>
        <Story />
        <Ending />
      </main>
      <footer className="intro-footer">
        <span>Mint to Coin, Coin to CryptoLab</span>
        <span>
          MINT · 한국경제TV 크립토랩 디자인 시스템 · <Link href="/changelog">변경 이력</Link>
        </span>
      </footer>
    </div>
  );
}
