import { Switch } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    // name을 주면 켜졌을 때 폼 제출에 "on"(또는 value)으로 담겨요
    <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Switch defaultChecked name="push">
        푸시 알림
      </Switch>
      <Switch value="yes" name="email">
        이메일 알림
      </Switch>
    </form>
  );
}
