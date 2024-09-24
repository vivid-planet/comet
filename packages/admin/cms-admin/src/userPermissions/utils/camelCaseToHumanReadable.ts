export function camelCaseToHumanReadable(s: string | number) {
    const words = s.toString().match(/[A-Za-z0-9][a-z0-9]*/g) || [];
    return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
}
