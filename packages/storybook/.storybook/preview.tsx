import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "../../core/src/index.css";

// 코드 패널에 보이는 JSX를 읽기 좋게 다듬는다.
// - function uY(){} 같은 함수 표기를 () => {}로 통일하고, 아무것도 하지 않는 핸들러(onChange={() => {}})는 뺀다
// - width/height만 주는 레이아웃용 바깥 <div>(스토리를 가운데 두려는 decorator)는 뺀다
const LAYOUT_STYLE_KEYS = new Set([
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "padding",
]);

function cleanSource(code: string): string {
  let result = code
    .replace(/function\s*\w*\s*\([^)]*\)\s*\{\s*\}/g, "() => {}")
    .replace(/[ \t]*\n?[ \t]+on[A-Z]\w*=\{\(\) => \{\}\}(?=[\s/>])/g, "");

  const wrapper = result.match(/^<div\s+style=\{\{([^}]*)\}\}\s*>\n([\s\S]*)\n<\/div>$/);
  if (wrapper) {
    const keys = wrapper[1]
      .split(",")
      .map((entry) => entry.split(":")[0].trim())
      .filter(Boolean);
    if (keys.every((key) => LAYOUT_STYLE_KEYS.has(key))) {
      result = wrapper[2].replace(/^ {2}/gm, "");
    }
  }
  return result;
}

const preview: Preview = {
  // 모든 스토리에 Docs 탭을 동일하게 제공
  tags: ["autodocs"],

  parameters: {
    options: {
      storySort: {
        order: [
          "Foundations",
          "Components",
          [
            "Actions",
            ["Button", "IconButton"],
            "Form",
            ["Calendar", "CheckMark", "Checkbox", "Chip", "Framed", "Radio"],
            "Navigation",
            ["Category", "PageIndicator", "Pagination", "SegmentedControl"],
            "Display",
            ["Avatar", "Badge", "Icon", "Text"],
            "Layout",
            ["Grid"],
            "Loading",
            ["Circular", "Skeleton"],
            "Overlay",
            ["Alert"],
          ],
          "Hooks",
          ["useOverlay", "useInView", "useClipboard", "useDebounceValue"],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      source: {
        // 모든 스토리가 "렌더된 JSX"를 같은 방식으로 보여 준다.
        type: "dynamic",
        // 레이아웃용 decorator(width/height div 등)는 코드에 넣지 않는다
        excludeDecorators: true,
        transform: cleanSource,
      },
    },

    // 반응형 확인용 화면 폭. Figma 디자인 프레임 폭(360 · 768 · 1440)과 구간 경계(768 · 1024)에 맞춘다
    viewport: {
      options: {
        mobile: { name: "Mobile 360", styles: { width: "360px", height: "800px" } },
        mobileSmall: { name: "Mobile 320 (최소)", styles: { width: "320px", height: "720px" } },
        tablet: { name: "Tablet 768", styles: { width: "768px", height: "1024px" } },
        desktopStart: { name: "Desktop 1024 (시작)", styles: { width: "1024px", height: "800px" } },
        desktop: { name: "Desktop 1440", styles: { width: "1440px", height: "900px" } },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  initialGlobals: {
    theme: "light",
  },

  globalTypes: {
    theme: {
      description: "라이트/다크 테마",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    // 툴바의 Theme 값을 <html data-theme>에 반영한다. 테마 Provider가 생기면 그것으로 바꾼다.
    function ThemeDecorator(Story, context) {
      const theme = context.globals.theme ?? "light";
      useEffect(() => {
        document.documentElement.dataset.theme = theme;
      }, [theme]);
      return (
        <div
          style={{
            minHeight: "100%",
            padding: 24,
            background: "var(--mint-background-default)",
            color: "var(--mint-text-primary)",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
