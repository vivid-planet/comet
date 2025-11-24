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

type MetricType = "Counter" | "UpDownCounter" | "Histogram" | "ObservableGauge" | "ObservableCounter" | "ObservableUpDownCounter";
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
    return getOrCreate(name, options, "Histogram") as Histogram;
}

export function getOrCreateCounter(name: string, options: MetricOptions = {}): Counter {
    return getOrCreate(name, options, "Counter") as Counter;
}

// TODO: metric functions below are here for demonstration purpose. More metrics will be added in the future which will probably need this functions.
/*
export function getOrCreateUpDownCounter(name: string, options: MetricOptions = {}): UpDownCounter {
    return getOrCreate(name, options, "UpDownCounter") as UpDownCounter;
}

export function getOrCreateObservableGauge(name: string, options: MetricOptions = {}): ObservableGauge {
    return getOrCreate(name, options, "ObservableGauge") as ObservableGauge;
}

export function getOrCreateObservableCounter(name: string, options: MetricOptions = {}): ObservableCounter {
    return getOrCreate(name, options, "ObservableCounter") as ObservableCounter;
}

export function getOrCreateObservableUpDownCounter(name: string, options: MetricOptions = {}): ObservableUpDownCounter {
    return getOrCreate(name, options, "ObservableUpDownCounter") as ObservableUpDownCounter;
}
*/
