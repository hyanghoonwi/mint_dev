"use client";

import { Switch, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function SwitchPlayground() {
  return (
    <Playground
      stageMinHeight={160}
      controls={[
        { prop: "checked", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "label", type: "boolean", default: true },
      ]}
      render={(values) => (
        <Switch
          key={String(values.checked)}
          aria-label={values.label ? undefined : "알림 받기"}
          defaultChecked={values.checked as boolean}
          disabled={values.disabled as boolean}
        >
          {values.label ? "알림 받기" : undefined}
        </Switch>
      )}
      code={(values) =>
        jsx(
          "Switch",
          {
            "aria-label": values.label ? undefined : "알림 받기",
            defaultChecked: values.checked ? true : undefined,
            disabled: values.disabled ? true : undefined,
          },
          values.label ? "알림 받기" : undefined,
        )
      }
    />
  );
}

/** Switch 사용 가이드 그림 */
export function SwitchGuide() {
  return (
    <DoDont
      good={<Switch defaultChecked>알림 받기</Switch>}
      goodText={<>설정 이름을 옆에 레이블로 적어 무엇을 켜는지 알려요.</>}
      bad={
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch tabIndex={-1} aria-label="꺼짐" />
          <Text as="span" variant="body-2-regular" color="primary">
            꺼짐
          </Text>
        </div>
      }
      badText={
        <>&quot;꺼짐&quot; 같은 부정 표현으로 이름 짓지 않아요. &quot;알림 받기&quot;처럼 써요.</>
      }
    />
  );
}
