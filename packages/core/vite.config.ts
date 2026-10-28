import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import pkg from "./package.json" with { type: "json" };

// 의존성은 번들에 넣지 않는다. React가 두 벌 들어가면 훅이 깨지고, 나머지는 사용하는 쪽 번들러가 중복을 정리한다.
const external = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)];

export default defineConfig({
  plugins: [react(), dts({ entryRoot: "src" })],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => external.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        // 파일 하나로 합치지 않고 소스 파일마다 결과 파일을 만든다.
        // 합치면 파일 맨 위의 "use client"가 사라져 Next.js(App Router)가 클라이언트 컴포넌트를 알아보지 못한다.
        // 파일 단위라서 사용하는 쪽에서 쓰지 않는 컴포넌트가 빠지는(트리 셰이킹) 효과도 있다.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
