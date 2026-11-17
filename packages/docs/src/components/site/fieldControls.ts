import type { Control } from "./Playground";

/** Select·TextField의 공통 설정은 이름·순서·선택지·기본값을 함께 관리합니다. */
export function fieldControls({
  label,
  placeholder,
  content = [],
  behavior = [],
}: {
  label: string;
  placeholder: string;
  content?: Control[];
  behavior?: Control[];
}): Control[] {
  return [
    { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
    { prop: "label", type: "text", default: label },
    { prop: "placeholder", type: "text", default: placeholder },
    { prop: "helper", type: "text", default: "도움말 메시지" },
    { prop: "helpIcon", type: "boolean", default: false },
    ...content,
    {
      prop: "status",
      type: "select",
      options: ["normal", "negative", "positive"],
      default: "normal",
    },
    { prop: "disabled", type: "boolean", default: false },
    { prop: "readOnly", type: "boolean", default: false },
    { prop: "required", type: "boolean", default: false },
    ...behavior,
    { prop: "labelPosition", type: "select", options: ["top", "left"], default: "top" },
  ];
}
