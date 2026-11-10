import type { CSSProperties } from "react";
import Example from "../Example";
import { TabsClient } from "./TabsClient";

/**
 * 특별한 사용 상황을 탭으로 보여 준다. 탭마다 예시 파일(`src/examples/…`) 하나:
 * 위에 실제로 그린 구성, 아래에 그 코드가 나온다.
 */
export function ExampleTabs({
  items,
}: {
  items: { title: string; name: string; style?: CSSProperties }[];
}) {
  return (
    <TabsClient labels={items.map((item) => item.title)}>
      {items.map((item) => (
        <Example key={item.name} name={item.name} style={item.style} />
      ))}
    </TabsClient>
  );
}
