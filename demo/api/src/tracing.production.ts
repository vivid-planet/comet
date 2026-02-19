import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { NodeSDK } from "@opentelemetry/sdk-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
    metricReaders: [
        new PrometheusExporter(
            {
                port: 9465,
            },
            () => {
                const { endpoint } = PrometheusExporter.DEFAULT_OPTIONS;
                console.log(`prometheus scrape endpoint: http://localhost:9465${endpoint}`);
            },
        ),
    ],
    instrumentations: [],
    serviceName: "demo-api",
});

sdk.start();
