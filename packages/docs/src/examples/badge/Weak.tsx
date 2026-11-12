import { Badge } from "@futurewiz-rms/mint";

export default function Weak() {
  return (
    <>
      <Badge variant="weak" color="brand">
        강조
      </Badge>
      <Badge variant="weak" color="neutral">
        일반
      </Badge>
      <Badge variant="weak" color="danger">
        마감임박
      </Badge>
      <Badge variant="weak" color="success">
        완료
      </Badge>
      <Badge variant="weak" color="warning">
        주의
      </Badge>
      <Badge variant="weak" color="teal">
        시그널
      </Badge>
      <Badge variant="weak" color="violet">
        리포트
      </Badge>
      <Badge variant="weak" color="pink">
        이벤트
      </Badge>
    </>
  );
}
