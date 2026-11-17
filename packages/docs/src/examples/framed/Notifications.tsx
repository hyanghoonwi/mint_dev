import { FramedCheckbox } from "@futurewiz-rms/mint";

export default function Notifications() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 360, maxWidth: "100%" }}>
      <FramedCheckbox
        label="이메일"
        description="주 1회 시장 요약을 받아요"
        value="email"
        defaultChecked
        name="channel"
      />
      <FramedCheckbox
        label="푸시 알림"
        description="가격 도달 시 바로 알려요"
        value="push"
        name="channel"
      />
      <FramedCheckbox
        label="문자"
        description="중요한 보안 알림만 받아요"
        value="sms"
        name="channel"
      />
    </div>
  );
}
