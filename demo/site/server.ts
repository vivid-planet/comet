import { createServer } from "http";
import next from "next";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const cdnOriginCheckSecret = process.env.CDN_ORIGIN_CHECK_SECRET;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    if (process.env.TRACING_ENABLED) {
        require("./tracing");
    }
    createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const parsedUrl = parse(req.url!, true);

            if (cdnOriginCheckSecret) {
                if (req.headers["x-cdn-origin-check"] !== cdnOriginCheckSecret) {
                    res.statusCode = 403;
                    res.end();
                    return;
                }
            }
            if (
                parsedUrl.pathname?.startsWith("/assets/") || // TODO move public/* files into public/assets folder
                parsedUrl.pathname == "/favicon.ico" ||
                parsedUrl.pathname == "/robots.txt" ||
                parsedUrl.pathname == "/sitemap.xml"
            ) {
                res.setHeader("Cache-Control", "public, max-age=900");
                const origSetHeader = res.setHeader;
                res.setHeader = function (name: string, value: string | number | readonly string[]) {
                    if (name === "cache-control" || name === "Cache-Control") {
                        // ignore
                        return;
                    }
                    return origSetHeader.call(this, name, value);
                };
            }

            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    })
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`> Ready on http://localhost:${port}`);
        });
});
