import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

// Workspace packages are consumed directly from their TypeScript source via
// aliases, so no separate build step is needed for packages/*.
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Куманово Транзит",
        short_name: "КТ Транзит",
        description: "Јавен превоз во Куманово — линии, постојки и возен ред.",
        theme_color: "#ec3013",
        background_color: "#f3f2f2",
        display: "standalone",
        start_url: "/",
        lang: "mk",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": r("./src"),
      "@kt/data": r("../../packages/data/src/index.ts"),
      "@kt/shared": r("../../packages/shared/src/index.ts"),
    },
  },
  server: {
    // Allow importing source from the monorepo root (workspace packages).
    fs: { allow: [r("../..")] },
  },
});
