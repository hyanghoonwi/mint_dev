import { Divider, Text } from "@futurewiz-rms/mint";

const menus = ["알림 설정", "개인정보 보호", "고객센터"];

export default function InList() {
  return (
    <div style={{ width: 320, background: "var(--mint-background-default)" }}>
      {menus.map((menu, i) => (
        <div key={menu}>
          {i > 0 && <Divider inset />}
          <Text as="p" variant="body-2-regular" className="px-5 py-4">
            {menu}
          </Text>
        </div>
      ))}
    </div>
  );
}
