export function camelCaseToHumanReadable(s: string | number) {
    const words =
        s
            .toString()
            .replace(/([A-Z0-9]+)([A-Z][a-z])/g, "$1 $2") // "XYZTest" -> "XYZ Test"
            .replace(/([a-z])([A-Z])/g, "$1 $2") // "xyzTest" -> "xyz Test"
            .split(/\s+/) || [];
    return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
}
