import type { ReactNode } from "react";
import "./intro.css";

/**
 * 인트로(/)는 테마와 무관하게 항상 어두운 화면이라 테마 제공자를 두지 않는다.
 * (next-themes의 ThemeProvider는 <script>를 렌더해서 React 19가 콘솔 오류를 낸다.
 * 문서 쪽 테마는 Nextra 레이아웃이 따로 관리한다.)
 */
export function IntroShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
