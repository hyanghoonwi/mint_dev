// 반응형 prop 도우미. 크기·배치처럼 CSS로 바꿀 수 있는 prop이 "값 하나" 또는 "구간별 객체"를 받게 한다.
//   size="md"                          → 모든 화면에서 md
//   size={{ base: "lg", tablet: "md" }} → 모바일 lg, 태블릿(768px~)부터 md. 빈 구간은 앞 구간 값을 이어받는다
// 화면 폭은 CSS(브레이크포인트 접두어)로만 나눈다. 서버가 화면 폭을 몰라도 결과가 같아서 깜빡임이 없다.
// Tailwind는 클래스 이름을 정적으로 찾으므로 `tablet:${...}`처럼 조립하지 않는다. 구간마다 클래스를 통째로 적은 표를 넘긴다.

/** MINT 구간: 모바일(기본) · 태블릿(768px~) · 데스크톱(1024px~) */
export type Breakpoint = "base" | "tablet" | "desktop";

/** 값 하나, 또는 구간별 값. `base`를 빼면 컴포넌트 기본값을 쓴다 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/** 구간별 클래스 표. 키는 값(boolean은 "true"/"false")이고, tablet·desktop 칸에는 접두어가 붙은 클래스를 그대로 적는다 */
export type ResponsiveClassTable<K extends string> = Record<Breakpoint, Record<K, string>>;

export function isResponsiveObject<T>(
  value: Responsive<T> | undefined,
): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 반응형 값에서 구간별 값을 꺼낸다. 값 하나면 base에만 둔다 */
export function resolveResponsive<T>(
  value: Responsive<T> | undefined,
  fallback: T,
): Partial<Record<Breakpoint, T>> & { base: T } {
  if (!isResponsiveObject(value)) return { base: value ?? fallback };
  return { ...value, base: value.base ?? fallback };
}

/** 반응형 값을 구간별 클래스로 바꾼다. 앞 구간과 같은 값이면 클래스를 다시 붙이지 않는다 */
export function responsiveClasses<T extends string | boolean>(
  value: Responsive<T> | undefined,
  fallback: T,
  table: ResponsiveClassTable<`${T}`>,
): string {
  const resolved = resolveResponsive(value, fallback);
  const out = [table.base[`${resolved.base}` as `${T}`]];
  let previous = resolved.base;
  for (const breakpoint of ["tablet", "desktop"] as const) {
    const next = resolved[breakpoint];
    if (next === undefined || next === previous) continue;
    out.push(table[breakpoint][`${next}` as `${T}`]);
    previous = next;
  }
  return out.join(" ");
}
