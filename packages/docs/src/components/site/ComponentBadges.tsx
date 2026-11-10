import { Badge } from "@futurewiz-rms/mint";

/** 컴포넌트 문서 제목 아래의 사용 환경 뱃지. 쓸 수 있는 환경이라 초록(success)으로 보여 준다 */
export function ComponentBadges() {
  return (
    <div className="docs-component-badges">
      <Badge variant="weak" color="success" size="md">
        Next.js
      </Badge>
      <Badge variant="weak" color="success" size="md">
        React
      </Badge>
    </div>
  );
}
