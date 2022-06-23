export function serializeInitialValues<InitialValues = Record<string, unknown>>(initialValues: Partial<InitialValues> = {}): string {
    return encodeURIComponent(JSON.stringify(initialValues));
}
