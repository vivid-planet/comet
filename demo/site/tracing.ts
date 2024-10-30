import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { IncomingMessage } from "http";

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
