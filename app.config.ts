import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";
import { env } from "process";

export default defineConfig({
  vite: () => {
    return {
      ssr: {
        external: ["@prisma/client"],
      },
      resolve: {
        alias: {
          ".prisma/client/index-browser":
            "./node_modules/.prisma/client/index-browser.js",
          $fonts: resolve(
            env.NODE_ENV !== "production" ? "./fonts" : "./public/fonts"
          ),
        },
      },
      server: {
        port: parseInt(env.PORT || "3000"),
      },
    };
  },
  server: { preset: env.PRESET || "node-server" },
  middleware: "./src/middleware.ts",
});
