export const defaultFilterOutKeys: string[] = ["updatedAt", "createdAt"];

function isObject(value: unknown): value is object {
    return value !== null && typeof value === "object";
}

export const filterOutKeys = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: Record<string, any>,
    keysToBeRemoved: string[],
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Record<string, any> => {
    if (Array.isArray(object)) {
        return object.map((item) => filterOutKeys(item, keysToBeRemoved));
    } else if (isObject(object)) {
        return Object.fromEntries(
            Object.entries(object)
                .filter(([key]) => !keysToBeRemoved.includes(key))
                .map(([key, value]) => [key, isObject(value) || Array.isArray(value) ? filterOutKeys(value, keysToBeRemoved) : value]),
        );
    }

    return object;
};
