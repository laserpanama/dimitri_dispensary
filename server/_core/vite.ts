import path from "path";
import fs from "fs";
import type { Express } from "express";
import type { Server } from "http";
import express from "express";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * In development, sets up Vite's dev server middleware.
 */
export async function setupVite(app: Express, server: Server) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
  });

  app.use(vite.middlewares);

  // Catch‑all for client‑side routing – delegate to Vite
  // ✅ Use regex to avoid Express 5 path‑to‑regexp issues
  app.use(/.*/, async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "../../client/index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule(
        path.resolve(__dirname, "../../client/src/entry-server.tsx")
      );
      const { html: appHtml } = await render(url);
      const html = template.replace("<!--ssr-outlet-->", appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * In production, serves the built static files.
 */
export function serveStatic(app: Express) {
  // ✅ Correct path: server runs in /app, static files are in /app/dist/public
  const distPath = path.join(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static assets
  app.use(express.static(distPath));

  // All unmatched requests go to index.html – client‑side routing
  // ✅ Use regex to avoid Express 5 path‑to‑regexp issues
  app.use(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}