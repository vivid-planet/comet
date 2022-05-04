const https = require("https");
const httpProxy = require("http-proxy");
const fs = require("fs");

const services = [
    {
        dnsPrefix: new RegExp(`^imgproxy-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
        proxyPort: process.env.IMGPROXY_PORT,
    },
    {
        dnsPrefix: new RegExp(`^admin-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
        proxyPort: process.env.ADMIN_PORT,
    },
    {
        dnsPrefix: new RegExp(`^api-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
        proxyPort: process.env.API_PORT,
    },
    {
        dnsPrefix: new RegExp(`^site-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
        proxyPort: process.env.SITE_PORT,
    },
    {
        dnsPrefix: new RegExp(`^idp-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
        proxyPort: process.env.IDP_PORT,
        proxyOptions: {
            xfwd: true, // Forward X-Forwarded-Proto Headers to node-oidc-server (https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#trusting-tls-offloading-proxies)
        },
    },
    ...(process.env.API_ENABLE_APM
        ? [
              {
                  dnsPrefix: new RegExp(`^kibana-${process.env.DEV_DOMAIN_POSTFIX}\\.`),
                  proxyPort: process.env.KIBANA_PORT,
              },
          ]
        : []),
];

function getTarget(req) {
    const service = services.find((s) => s.dnsPrefix.test(req.headers.host));
    if (service === undefined) return undefined;
    return {
        target: {
            host: "localhost",
            port: service.proxyPort,
        },
        ...service.proxyOptions,
    };
}

const proxy = httpProxy.createServer();
const server = https.createServer(
    {
        key: fs.readFileSync("./certs/privkey.pem", "utf8"),
        cert: fs.readFileSync("./certs/cert.pem", "utf8"),
        ca: fs.readFileSync("./certs/fullchain.pem", "utf8"),
    },
    function (req, res) {
        const target = getTarget(req);

        if (!target) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();
        } else {
            console.log("balancing request to: ", target);
            proxy.web(req, res, target, (err) => {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write(`${err}\n`);
                res.end();
            });
        }
    },
);

server.on("upgrade", function (req, socket, head) {
    const target = getTarget(req);

    console.log("balancing socket to: ", target);
    proxy.ws(req, socket, head, target);
});

server.listen(process.env.PROXY_PORT);
console.log(`Proxy is running on: ${process.env.PROXY_PORT}`);
