import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { NodeSDK } from "@opentelemetry/sdk-node";

//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
    metricReader: new PrometheusExporter({}, () => {
        const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;
        // eslint-disable-next-line no-console
        console.log(`prometheus scrape endpoint: http://localhost:${port}${endpoint}`);
    }),
    instrumentations: [],
    serviceName: "demo-site",
});

sdk.start();
