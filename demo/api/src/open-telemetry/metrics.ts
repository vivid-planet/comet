import {
    Counter,
    Histogram,
    MetricOptions,
    metrics,
    ObservableCounter,
    ObservableGauge,
    ObservableUpDownCounter,
    UpDownCounter,
} from "@opentelemetry/api";

enum MetricType {
    "Counter" = "Counter",
    "UpDownCounter" = "UpDownCounter",
    "Histogram" = "Histogram",
    "ObservableGauge" = "ObservableGauge",
    "ObservableCounter" = "ObservableCounter",
    "ObservableUpDownCounter" = "ObservableUpDownCounter",
}
type GenericMetric = Counter | UpDownCounter | Histogram | ObservableGauge | ObservableCounter | ObservableUpDownCounter;
const OTEL_METER_NAME = "nestjs-otel";

const meterData: Map<string, GenericMetric> = new Map();

function getOrCreate(name: string, options: MetricOptions = {}, type: MetricType): GenericMetric | undefined {
    let metric = meterData.get(name);
    if (metric === undefined) {
        const meter = metrics.getMeterProvider().getMeter(OTEL_METER_NAME);
        metric = meter[`create${type}`](name, options);
        meterData.set(name, metric);
    }
    return metric;
}

export function getOrCreateHistogram(name: string, options: MetricOptions = {}): Histogram {
    return getOrCreate(name, options, MetricType.Histogram) as Histogram;
}

export function getOrCreateCounter(name: string, options: MetricOptions = {}): Counter {
    return getOrCreate(name, options, MetricType.Counter) as Counter;
}
