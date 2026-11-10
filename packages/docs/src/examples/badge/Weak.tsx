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
    </>
  );
}
