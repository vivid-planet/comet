export function cleanTypename<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(cleanTypename) as unknown as T;
    }

    if (data !== null && typeof data === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        for (const [key, value] of Object.entries(data)) {
            if (key !== "__typename") {
                result[key] = cleanTypename(value);
            }
        }
        return result;
    }

    return data;
}
