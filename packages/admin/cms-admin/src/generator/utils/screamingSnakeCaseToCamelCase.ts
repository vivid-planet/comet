export function screamingSnakeCaseToCamelCase(s: string) {
    const words = s.toLowerCase().split("_");
    return words.map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))).join("");
}
