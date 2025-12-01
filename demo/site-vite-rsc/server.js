import { Hono } from "hono";
import { serve } from "@hono/node-server";
import rscHandler from "./dist/rsc/index.js";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "path";
import { compress } from 'hono/compress'

const app = new Hono();

app.use(compress())

app.use(
  "/assets/*",
  serveStatic({
    root: path.join(process.cwd(), "dist/client"),
    precompressed: true,
  })
);
app.use(
  "/*",
  serveStatic({
    root: path.join(process.cwd(), "public"),
  })
);
// Mount RSC handler for everything else
app.all("*", async (c) => {
  const req = c.req.raw;
  const res = c.res.raw;
  return await rscHandler(req, res);
});


const port = 3000;
serve({ fetch: app.fetch, port });
console.log(`🚀 Hono + Vite RSC server running at http://localhost:${port}`);
