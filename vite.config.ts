import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { whop } from "@whop/cli/vite";
import app from "./server/index";

export default defineConfig({
  plugins: [
    react(),
    whop(),
    {
      name: "api-server-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/api")) {
            app(req as any, res as any, next);
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist/client",
  },
});
