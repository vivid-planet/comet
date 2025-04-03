export function removeTypenameKeys(data: unknown) {
    return JSON.parse(JSON.stringify(data), (key, value) => (key === "__typename" ? undefined : value));
}
