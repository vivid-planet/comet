export function cleanTypename(data: unknown) {
    return JSON.parse(JSON.stringify(data), (key, value) => (key === "__typename" ? undefined : value));
}
