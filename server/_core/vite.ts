import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, esbuild outputs index.ts → dist/index.js, so
  // import.meta.dirname = dist/  →  dist/public is the Vite build output.
  // In development, resolve from the project root instead.
  const distPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public")        // dist/public ✓
      : path.resolve(import.meta.dirname, "../..", "dist", "public"); // dev fallback

  if (!fs.existsSync(distPath)) {
    console.error(
      `Build directory not found: ${distPath}\n` +
        `Run "pnpm build" first, then restart the server.`
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
