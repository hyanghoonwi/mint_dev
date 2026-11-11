import type { MDXComponents } from "mdx/types";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { Callout } from "nextra/components";
import Example from "./src/components/Example";
import {
  DocsFooter,
  Figure,
  Hero,
  LinkButtons,
  LinkCards,
  ListRows,
  PageLink,
  Principles,
} from "./src/components/site/Landing";
import {
  AvatarGroupGuide,
  AvatarGroupPlayground,
  AvatarGuide,
  AvatarPlayground,
} from "./src/components/site/AvatarDocs";
import { AlertGuide, AlertPlayground } from "./src/components/site/AlertDocs";
import { BadgeGuide, BadgePlayground } from "./src/components/site/BadgeDocs";
import { CategoryGuide, CategoryPlayground } from "./src/components/site/CategoryDocs";
import { CalendarGuide, CalendarPlayground } from "./src/components/site/CalendarDocs";
import {
  SegmentedControlGuide,
  SegmentedControlPlayground,
} from "./src/components/site/SegmentedControlDocs";
import { PaginationGuide, PaginationPlayground } from "./src/components/site/PaginationDocs";
import {
  PageIndicatorGuide,
  PageIndicatorPlayground,
} from "./src/components/site/PageIndicatorDocs";
import { CheckMarkGuide, CheckMarkPlayground } from "./src/components/site/CheckMarkDocs";
import { CheckboxGuide, CheckboxPlayground } from "./src/components/site/CheckboxDocs";
import { ChipGuide, ChipPlayground } from "./src/components/site/ChipDocs";
import { RadioGuide, RadioPlayground } from "./src/components/site/RadioDocs";
import { FramedGuide, FramedPlayground } from "./src/components/site/FramedDocs";
import { CircularGuide, CircularPlayground } from "./src/components/site/CircularDocs";
import { TextGuide, TextPlayground } from "./src/components/site/TextDocs";
import { IconButtonGuide, IconButtonPlayground } from "./src/components/site/IconButtonDocs";
import {
  SkeletonCirclePlayground,
  SkeletonGuide,
  SkeletonRectanglePlayground,
  SkeletonTextPlayground,
} from "./src/components/site/SkeletonDocs";
import { ButtonGuide, ButtonPlayground } from "./src/components/site/ButtonDocs";
import { ComponentBadges } from "./src/components/site/ComponentBadges";
import { ExampleTabs } from "./src/components/site/ExampleTabs";
import { ColorPalette } from "./src/components/site/ColorPalette";
import { GridColumns, SpacingScale, Typeface, TypeScale } from "./src/components/site/Foundations";
import { IconGallery } from "./src/components/site/IconGallery";
import { ComponentCards, FoundationCards } from "./src/components/site/Catalog";
import { Home } from "./src/components/site/Home";
import { CopyCode } from "./src/components/site/CopyCode";

const docsComponents = getDocsMDXComponents();

// 제목 위에 붙는 분류 라벨. 문서 경로의 첫 폴더로 정한다.
const eyebrows: Record<string, string> = {
  "getting-started": "Getting started",
  foundations: "Foundations",
  components: "Components",
};

const DocsWrapper: NonNullable<MDXComponents["wrapper"]> = (props) => {
  const Wrapper = docsComponents.wrapper!;
  const route = String(props.metadata?.filePath ?? "")
    .replace(/^content\//, "")
    .split("/")[0]
    .replace(/\.mdx?$/, "");
  const eyebrow = eyebrows[route];
  return (
    <Wrapper {...props}>
      {eyebrow && <p className="docs-eyebrow">{eyebrow}</p>}
      {props.children}
      {/* 첫 화면(/)은 자체 푸터가 있다 */}
      {route !== "index" && <DocsFooter />}
    </Wrapper>
  );
};

// 코드 블록(```)마다 복사 버튼을 붙인다. Nextra 기본 버튼은 마우스를 올려야 보여서 쓰지 않는다.
// <Example>의 코드(MDXRemote)도 이 목록을 쓰므로 함께 적용된다
const DocsPre: NonNullable<MDXComponents["pre"]> = (props) => {
  const Pre = docsComponents.pre!;
  return (
    <CopyCode>
      <Pre {...props} />
    </CopyCode>
  );
};

// MDX에서 import 없이 쓸 컴포넌트. 예시 코드는 <Example name="..." />, 나머지는 문서 사이트 화면 조각이다.
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...docsComponents,
    wrapper: DocsWrapper,
    pre: DocsPre,
    Callout,
    Example,
    Hero,
    LinkCards,
    Principles,
    Figure,
    LinkButtons,
    ListRows,
    PageLink,
    ButtonPlayground,
    ComponentBadges,
    ExampleTabs,
    AvatarPlayground,
    AvatarGroupPlayground,
    AvatarGuide,
    AvatarGroupGuide,
    BadgePlayground,
    BadgeGuide,
    PaginationPlayground,
    PaginationGuide,
    PageIndicatorPlayground,
    PageIndicatorGuide,
    CategoryPlayground,
    CategoryGuide,
    CalendarPlayground,
    CalendarGuide,
    SegmentedControlPlayground,
    SegmentedControlGuide,
    FramedPlayground,
    FramedGuide,
    RadioPlayground,
    RadioGuide,
    ChipPlayground,
    ChipGuide,
    CheckboxPlayground,
    CheckboxGuide,
    CheckMarkPlayground,
    CheckMarkGuide,
    IconButtonPlayground,
    IconButtonGuide,
    TextPlayground,
    TextGuide,
    CircularPlayground,
    CircularGuide,
    SkeletonTextPlayground,
    SkeletonRectanglePlayground,
    SkeletonCirclePlayground,
    SkeletonGuide,
    AlertPlayground,
    AlertGuide,
    ButtonGuide,
    ColorPalette,
    TypeScale,
    Typeface,
    SpacingScale,
    GridColumns,
    IconGallery,
    ComponentCards,
    FoundationCards,
    Home,
    ...components,
  };
}
