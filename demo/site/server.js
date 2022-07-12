// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.APP_PORT ?? 3000;
const cdnEnabled = process.env.CDN_ENABLED === "true";
const cdnOriginHeader = process.env.CDN_ORIGIN_HEADER;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);

        if (cdnEnabled) {
            const incomingCdnOriginHeader = req.headers["x-cdn-origin-check"];
            if (cdnOriginHeader !== incomingCdnOriginHeader) {
                res.statusCode = 403;
                res.end();
                return;
            }
        }
        if (parsedUrl.pathname === "/access-token-service-worker.js") {
            const filename = require.resolve("@comet/cms-site/access-token-service-worker.ejs");
            const { mtime } = fs.statSync(filename);
            res.setHeader("Cache-Control", "public, max-age=0");
            res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
            res.setHeader("Last-Modified", mtime.toUTCString());
            const str = fs.readFileSync(filename).toString();
            res.end(str.replace(/<%= API_URL %>/g, process.env.API_URL));
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
