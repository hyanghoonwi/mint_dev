// 모양 → 내용 → 상태·동작 → 배치 → HTML·접근성 → 이벤트 → 확장.
// 같은 이름은 타입, 문서, Playground, Storybook에서 같은 자리에 둡니다.
const groups = [
  "variant color size shape tone elevation radius border overlay overlayColor fit aspectRatio bold underline",
  "children label heading body description placeholder helper helpIcon icon activeIcon leftAddon rightAddon leadingIcon leadingImage trailingContent image src alt badge badgeSize count items options all allLabel action actionArea addOn",
  "value defaultValue checked defaultChecked indeterminate selected active defaultActive open defaultOpen status error loading disabled readOnly required multiple render clearButton animate fade today month defaultMonth page current total marks holidays disabledDates min max limit duration snackbarDuration weekStartsOn",
  "fullWidth inline tight layout labelPosition orientation direction position arrowAlign align justify columns span padding cellPadding gap inset offset length lines width height maxHeight menuMaxHeight overflow",
  "as type id name htmlFor href linkComponent target rel autoComplete autoFocus maxLength minLength pattern tabIndex role",
];

const ranks = new Map(
  groups.flatMap((group, groupIndex) =>
    group.split(" ").map((name, index) => [name, groupIndex * 1000 + index]),
  ),
);

export function propRank(name, component = "") {
  const context = component.toLowerCase().replaceAll("-", "");
  if (context.includes("avatar") && name === "name") return ranks.get("src") + 0.5;
  if (context.includes("pricechange") && name === "type") return ranks.get("size") + 0.1;
  if (context.includes("pricechange") && name === "direction") return ranks.get("size") + 0.2;
  if ((context.includes("framed") || context.includes("pageindicator")) && name === "type")
    return -0.5;
  if (name === "content") return ranks.get("children") + 0.1;
  if (name === "background") return ranks.get("tone") + 0.1;
  if (name === "chip") return ranks.get("count") + 0.1;
  if (name === "scroll") return ranks.get("maxHeight") + 0.1;
  if (context.includes("textarea") && name === "addon") return ranks.get("rightAddon") + 0.1;
  if (name === "counter") return ranks.get("clearButton") + 0.1;
  if (name === "heightMode") return ranks.get("maxHeight") + 0.1;
  if (name === "trigger") return ranks.get("children") + 0.1;
  if (name === "placement") return ranks.get("position") + 0.1;
  if (name === "matchWidth") return ranks.get("fullWidth") + 0.1;
  if (name === "initialFocus") return ranks.get("autoFocus") + 0.1;
  if (name === "anchorRef") return ranks.get("autoFocus") + 0.2;
  if (name === "key") return -1;
  if (name.startsWith("aria-")) return 5100;
  if (name.startsWith("data-")) return 5200;
  if (/^on[A-Z]/.test(name) || name === "getHref") return 6000;
  if (name === "className") return 7000;
  if (name === "style") return 7001;
  if (name === "ref") return 7002;
  return ranks.get(name) ?? 2900;
}

export function compareProps(first, second, component = "") {
  return (
    propRank(first, component) - propRank(second, component) || first.localeCompare(second, "en")
  );
}
