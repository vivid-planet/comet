const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { IncomingMessage } = require("http");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: `http://localhost:${process.env.JAEGER_OLTP_PORT}/v1/traces`,
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            "@opentelemetry/instrumentation-http": {
                requestHook: (span, request) => {
                    if (request instanceof IncomingMessage && request.url) {
                        span.updateName(`HTTP ${request.method} ${request.url}`);
                    }
                },
            },
        }),
    ],
    serviceName: "demo-site",
});

sdk.start();
