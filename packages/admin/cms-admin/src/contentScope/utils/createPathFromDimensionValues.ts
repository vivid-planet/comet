/**
 * Creates a path string from the given dimension values.
 *
 * @param dimensionValues - An object where each key is a dimension and the value is a set of strings representing the values for that dimension.
 * @returns A string representing the path, with each dimension and its values formatted as `/:dimension(value1|value2|...)`.
 */
export function createPathFromDimensionValues(dimensionValues: { [dimension: string]: Set<string> }) {
    return Object.keys(dimensionValues).reduce((path, dimension) => {
        const plainValues = Array.from(dimensionValues[dimension]);
        const whiteListedValuesString = plainValues ? `(${plainValues.join("|")})` : "";
        return `${path}/:${dimension}${whiteListedValuesString}`;
    }, "");
}
