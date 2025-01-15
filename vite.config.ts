import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// 自动按需引入配置
import components from "unplugin-vue-components/vite";
import autoImport from "unplugin-auto-import/vite";

// element-plus组件库的自动引入配置
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
//s NaiveUi配置
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

import { viteSingleFile } from "vite-plugin-singlefile";

import { lazyImport, VxeResolver } from "vite-plugin-lazy-import";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile(),
    vueDevTools(),
    //s 自动导入
    autoImport({
      imports: [
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
      dts: "./types/auto-imports.d.ts",
    }),
    //s 组件自动导入
    components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
        NaiveUiResolver(),
      ],
      dirs: ["src/views"],
      dts: "./types/components.d.ts",
    }),
    lazyImport({
      resolvers: [
        VxeResolver({
          libraryName: "vxe-table",
        }),
        VxeResolver({
          libraryName: "vxe-pc-ui",
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  //s 打包配置
  build: {
    target: "es2015",
    // 使用terser进行压缩混淆
    minify: true,
  },
});
