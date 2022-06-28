/* eslint-disable no-undef */
const express = require("express");
const compression = require("compression");

const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(compression());

app.get("/status/health", (req, res) => {
    res.send("OK!");
});

// Serve static build an cache for 30d
app.use(
    express.static("../build", {
        setHeaders: (res, path, stat) => {
            if (path.endsWith(".html")) {
                // Don't cache the index.html at all
                // implemented as suggested by https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#preventing_caching
                res.setHeader("cache-control", "no-store, max-age: 0");
            } else if (path.endsWith(".js")) {
                // The js file is static and the index.html uses a parameter as cache buster
                // implemented as suggested by https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#caching_static_assets
                res.setHeader("cache-control", "public, max-age=31536000, immutable");
            } else {
                // Icons and Fonts could be changed over time
                res.setHeader("cache-control", "public, max-age=604800, immutable");
            }
        },
    }),
);

// As a fallback, route everything to index.html
app.get("*", (req, res) => {
    res.sendFile(`index.html`, { root: `${__dirname}/../build/` });
});

app.listen(port, () => {
    console.log(`Admin app listening at http://localhost:${port}`);
});
