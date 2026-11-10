import { Badge } from "@futurewiz-rms/mint";

export default function Fill() {
  return (
    <>
      <Badge color="brand">NEW</Badge>
      <Badge color="neutral">일반</Badge>
      <Badge color="danger">마감</Badge>
      <Badge color="success">완료</Badge>
      <Badge color="warning">주의</Badge>
    </>
  );
}
