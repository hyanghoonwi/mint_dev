import { Switch } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Switch defaultChecked>알림 받기</Switch>
      <Switch>다크 모드</Switch>
      <Switch disabled defaultChecked>
        자동 로그인
      </Switch>
      <Switch disabled>마케팅 정보 받기</Switch>
    </div>
  );
}
