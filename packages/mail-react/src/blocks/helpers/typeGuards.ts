export function hasProperty<K extends string>(value: unknown, key: K): value is Record<K, unknown> {
    return typeof value === "object" && value !== null && key in value;
}
