import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import * as opentelemetry from "@opentelemetry/sdk-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: `http://localhost:${process.env.JAEGER_OLTP_PORT}/v1/traces`,
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            "@opentelemetry/instrumentation-pg": {
                requestHook: (span, queryInfo) => {
                    span.updateName(`pg: ${queryInfo.query.text.substring(0, 100)}`);
                },
            },
            "@opentelemetry/instrumentation-knex": {
                enabled: false,
            },
            "@opentelemetry/instrumentation-graphql": {
                mergeItems: true,
            },
        }),
    ],
    serviceName: "demo-api",
});

sdk.start();
