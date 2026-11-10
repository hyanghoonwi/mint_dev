import { Badge } from "@futurewiz-rms/mint";

export default function InList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-body-3-regular text-text-strong">에어드랍 참여</span>
        <Badge variant="weak" color="success" size="sm">
          완료
        </Badge>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-body-3-regular text-text-strong">시그널 구독</span>
        <Badge variant="weak" color="danger" size="sm">
          마감임박
        </Badge>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-body-3-regular text-text-strong">이벤트 응모</span>
        <Badge variant="weak" color="neutral" size="sm">
          대기
        </Badge>
      </div>
    </div>
  );
}
