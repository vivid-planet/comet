// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.APP_PORT ?? 3000;
const cdnEnabled = process.env.CDN_ENABLED === "true";
const cdnOriginHeader = process.env.CDN_ORIGIN_HEADER;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        createServer(async (req, res) => {
            try {
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
                await handle(req, res, parsedUrl);
            } catch (err) {
                console.error("Error occurred handling", req.url, err);
                res.statusCode = 500;
                res.end("internal server error");
            }
        }).listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    })
    .catch((error) => console.error(error));
