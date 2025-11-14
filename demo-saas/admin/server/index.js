/* eslint-disable no-undef */
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const fs = require("fs");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.APP_PORT ?? 3000;
const host = process.env.SERVER_HOST ?? "localhost";

let indexFile = fs.readFileSync("./build/index.html", "utf8");

// Replace environment variables
indexFile = indexFile.replace(/\$([A-Z_]+)/g, (match, p1) => {
    return process.env[p1] || "";
});

app.use(compression());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "script-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "https:", "data:", "blob:"],
                "default-src": ["'self'", "https:"],
                "media-src": ["'self'", "https:"],
                "style-src": ["'self'", "https:", "'unsafe-inline'"],
                "font-src": ["'self'", "https:", "data:"],
            },
        },
        xXssProtection: false,
        strictTransportSecurity: {
            maxAge: 63072000,
            includeSubDomains: true,
            preload: true,
        },
    }),
);

app.get("/status/health", (req, res) => {
    res.setHeader("cache-control", "no-store");
    res.send("OK!");
});

const proxyMiddleware = createProxyMiddleware({
    target: process.env.API_URL_INTERNAL + "/dam",
    changeOrigin: true,
});
app.use("/dam", proxyMiddleware);

app.use(
    express.static("./build", {
        index: false, // Don't send index.html for requests to "/" as it will be handled by the fallback route (with replaced environment variables)
        setHeaders: (res, path, stat) => {
            if (path.endsWith(".js")) {
                // The js file is static and the index.html uses a parameter as cache buster
                // implemented as suggested by https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#caching_static_assets
                res.setHeader("cache-control", "private, max-age=31536000, immutable");
            } else {
                // Icons and Fonts could be changed over time, cache for 7d
                res.setHeader("cache-control", "private, max-age=604800, immutable");
            }
        },
    }),
);

// As a fallback, route everything to index.html
app.get("*", (req, res) => {
    // Don't cache the index.html at all to make sure applications updates are applied
    // implemented as suggested by https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#preventing_storing
    res.setHeader("cache-control", "no-store");
    res.send(indexFile);
});

app.listen(port, host, () => {
    console.log(`Admin app listening at http://${host}:${port}`);
});
