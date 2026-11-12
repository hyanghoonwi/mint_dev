"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./intro.css";
import {
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Chip,
  Circular,
  FramedCheckbox,
  HeartIcon,
  IconButton,
  PageCounter,
  PageDots,
  PlusIcon,
  Radio,
  RadioGroup,
  SegmentedControl,
  ShareNetworkIcon,
  SkeletonCircle,
  SkeletonText,
  Text,
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

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const rangeProgress = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));
const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3);

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
function gridLayout(width: number, height: number): GridLayout {
  const portrait = width < 768;
  const columnCount = portrait ? 2 : 4;
  const count = portrait ? 10 : 12;
  const rows = count / columnCount;
  const gridWidth = portrait ? width * 0.9 : Math.min(width * 0.86, 1080);
  const cellWidth = gridWidth / columnCount;
  const cellHeight = Math.min(cellWidth * 0.62, (height * 0.5) / rows);
  return {
    width,
    height,
    columns: columnCount,
    rows,
    cellWidth,
    cellHeight,
    gap: 12,
    originY: height * 0.36,
  };
}

/*
 * 격자 칸 12개에 들어가는 실제 MINT 컴포넌트(라이브러리에 있는 것만). 점 와이어프레임(particles.ts cardPaths)이 같은 순서로 대응한다.
 * 세로 화면은 앞의 10칸만 보인다. 격자 전체가 inert라서 누르거나 Tab으로 들어갈 수 없다(보여 주기용)
 */
function cell(cellIndex: number): ReactNode {
  switch (cellIndex) {
    case 0:
      return <Button size="lg">확인</Button>;
    case 1:
      return (
        <SegmentedControl
          aria-label="기간"
          defaultValue="week"
          items={[
            { value: "day", label: "일" },
            { value: "week", label: "주" },
            { value: "month", label: "월" },
          ]}
        />
      );
    case 2:
      return (
        <div className="intro-cell__row">
          <Chip active>전체</Chip>
          <Chip>메이저</Chip>
          <Chip>밈</Chip>
        </div>
      );
    case 3:
      return (
        <div className="intro-cell__stack is-start">
          <Checkbox defaultChecked>약관 동의</Checkbox>
          <RadioGroup defaultValue="on" aria-label="알림">
            <Radio value="on">알림 받기</Radio>
          </RadioGroup>
        </div>
      );
    case 4:
      return (
        <AvatarGroup
          aria-label="참여자"
          max={3}
          items={[
            { name: "민트" },
            { name: "코인" },
            { name: "랩" },
            { name: "하나" },
            { name: "둘" },
          ]}
        />
      );
    case 5:
      return (
        <div className="intro-cell__row">
          <Badge color="brand">NEW</Badge>
          <Badge variant="weak" color="success">
            완료
          </Badge>
          <Badge variant="weak" color="danger">
            경고
          </Badge>
        </div>
      );
    case 6:
      return (
        <div className="intro-cell__row">
          <IconButton variant="background" icon={<HeartIcon />} aria-label="좋아요" />
          <IconButton variant="outline" icon={<ShareNetworkIcon />} aria-label="공유" />
          <IconButton variant="solid" icon={<PlusIcon />} aria-label="추가" />
        </div>
      );
    case 7:
      return (
        <div className="intro-cell__stack">
          <PageDots current={2} total={5} />
          <PageCounter current={3} total={24} />
        </div>
      );
    case 8:
      return (
        <div className="intro-cell__row is-wide">
          <SkeletonCircle size={40} />
          <div className="intro-cell__stack is-start is-fill">
            <SkeletonText />
            <SkeletonText length="50%" />
          </div>
        </div>
      );
    case 9:
      return (
        <div className="intro-cell__stack">
          <Text variant="heading-2-bold" color="strong">
            오늘의 시세
          </Text>
          <Text variant="body-3-regular" color="tertiary">
            2026-11-11 업데이트
          </Text>
        </div>
      );
    case 10:
      return (
        <div className="intro-cell__row">
          <Circular color="brand" />
          <Button loading>저장</Button>
        </div>
      );
    default:
      return (
        <FramedCheckbox
          className="intro-cell__framed"
          defaultChecked
          label="자동 로그인"
          description="이 기기에서 유지해요"
        />
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

  useEffect(() => {
    const trackElement = track.current;
    const stageElement = stage.current;
    const canvasElement = canvas.current;
    if (!trackElement || !stageElement || !canvasElement) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let progress = 0;
    let scene: ParticleScene | null = null;
    let webglFailed = false;
    let disposed = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // DOM: 자막·진행 눈금·실제 컴포넌트 카드
    const apply = () => {
      const layout = gridLayout(width, height);
      const { columns: columnCount, rows, cellWidth, cellHeight, gap } = layout;
      const count = columnCount * rows;
      const contentScale = Math.min(1, cellHeight / 150, cellWidth / 230);
      // 와이어프레임이 완성된 뒤(93%~) 실제 카드가 나타난다. WebGL이 없으면 정렬 단계에서 바로 보여 준다
      const cardIn = easeOut(
        rangeProgress(progress, webglFailed ? 0.6 : 0.93, webglFailed ? 0.76 : 1),
      );
      for (let cellIndex = 0; cellIndex < 12; cellIndex++) {
        const cellElement = cells.current[cellIndex];
        if (!cellElement) continue;
        const offsetX = ((cellIndex % columnCount) - (columnCount - 1) / 2) * cellWidth;
        const offsetY = (Math.floor(cellIndex / columnCount) - (rows - 1) / 2) * cellHeight;
        const cardWidth = cellWidth - gap;
        const cardHeight = cellHeight - gap;
        cellElement.style.width = `${cardWidth}px`;
        cellElement.style.height = `${cardHeight}px`;
        cellElement.style.transform = `translate(${offsetX - cardWidth / 2}px, ${offsetY - cardHeight / 2}px)`;
        cellElement.style.opacity = cellIndex < count ? String(cardIn) : "0";
        const inner = cellElement.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `translate(-50%, -50%) scale(${contentScale})`;
      }

      chapters.forEach((chapter, chapterIndex) => {
        const [start, end] = chapter.range;
        const captionElement = captions.current[chapterIndex];
        if (!captionElement) return;
        const fadeIn =
          chapterIndex === 0 ? 1 : rangeProgress(progress, start + 0.01, start + 0.045);
        const fadeOut =
          chapterIndex === chapters.length - 1
            ? 0
            : rangeProgress(progress, end - 0.04, end - 0.005);
        const opacity = fadeIn * (1 - fadeOut);
        captionElement.style.opacity = String(opacity);
        captionElement.style.transform = `translateY(${(1 - fadeIn) * 28 - fadeOut * 16}px)`;
      });
    };

    const update = () => {
      frame = 0;
      const bounds = trackElement.getBoundingClientRect();
      progress = clamp(-bounds.top / (bounds.height - window.innerHeight));
      scene?.setProgress(progress);
      scene?.setVisible(bounds.bottom > 0 && bounds.top < window.innerHeight);
      apply();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const bounds = stageElement.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      scene?.resize(width, height, gridLayout(width, height));
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);

    // 점 장면: three.js는 여기서 처음 내려받는다
    import("./particles")
      .then(({ createParticleScene }) =>
        createParticleScene(canvasElement, gridLayout(width, height), { reducedMotion }),
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

  return (
    <div className="intro-track" ref={track}>
      <div className="intro-stage" ref={stage}>
        <canvas ref={canvas} className="intro-canvas" aria-hidden="true" />

        <div className="intro-grid" aria-hidden="true" inert>
          {Array.from({ length: 12 }, (_, cellIndex) => (
            <div
              key={cellIndex}
              className="intro-cell"
              ref={(element) => {
                cells.current[cellIndex] = element;
              }}
              style={{ opacity: 0 }}
            >
              <div className="intro-cell__inner">{cell(cellIndex)}</div>
            </div>
          ))}
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div
            key={chapter.title}
            className={`intro-caption ${chapter.mid ? "is-mid" : ""}`}
            ref={(element) => {
              captions.current[chapterIndex] = element;
            }}
            style={{ opacity: chapterIndex === 0 ? 1 : 0 }}
          >
            {chapterIndex === 0 ? (
              <h1 className="intro-caption__title">{chapter.title}</h1>
            ) : (
              <h2 className="intro-caption__title">{chapter.title}</h2>
            )}
            <p className="intro-caption__sub">{chapter.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 첫 화면(/) 맨 위의 스크롤 이야기. 문서 사이트 헤더 아래에 어두운 무대로 붙는다.
 * 이야기가 끝나면 아래로 첫 화면의 나머지(슬로건·바로가기·FAQ)가 이어진다.
 */
export function IntroStory() {
  return (
    <section className="intro" aria-label="MINT 소개" data-pagefind-ignore>
      <Story />
    </section>
  );
}
