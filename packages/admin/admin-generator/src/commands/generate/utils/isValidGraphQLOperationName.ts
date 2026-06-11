export function isValidGraphQLOperationName(name: string): boolean {
    return name.length > 0 && /^[_A-Za-z][_0-9A-Za-z]*$/.test(name);
}
