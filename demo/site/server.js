// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.APP_PORT ?? 3000;
const cdnOriginCheckSecret = process.env.CDN_ORIGIN_CHECK_SECRET;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        if (process.env.TRACING_ENABLED) {
            require("./tracing");
        }
        createServer(async (req, res) => {
            try {
                // Be sure to pass `true` as the second argument to `url.parse`.
                // This tells it to parse the query portion of the URL.
                const parsedUrl = parse(req.url, true);

                if (cdnOriginCheckSecret) {
                    if (req.headers["x-cdn-origin-check"] !== cdnOriginCheckSecret) {
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
