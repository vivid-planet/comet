import {
    type Counter,
    type Histogram,
    type MetricOptions,
    metrics,
    type ObservableCounter,
    type ObservableGauge,
    type ObservableUpDownCounter,
    type UpDownCounter,
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

// TODO: metric functions below are here for demonstration purpose. More metrics will be added in the future which will probably need this functions.
/*
export function getOrCreateUpDownCounter(name: string, options: MetricOptions = {}): UpDownCounter {
    return getOrCreate(name, options, MetricType.UpDownCounter) as UpDownCounter;
}

export function getOrCreateObservableGauge(name: string, options: MetricOptions = {}): ObservableGauge {
    return getOrCreate(name, options, MetricType.ObservableGauge) as ObservableGauge;
}

export function getOrCreateObservableCounter(name: string, options: MetricOptions = {}): ObservableCounter {
    return getOrCreate(name, options, MetricType.ObservableCounter) as ObservableCounter;
}

export function getOrCreateObservableUpDownCounter(name: string, options: MetricOptions = {}): ObservableUpDownCounter {
    return getOrCreate(name, options, MetricType.ObservableUpDownCounter) as ObservableUpDownCounter;
}
*/
