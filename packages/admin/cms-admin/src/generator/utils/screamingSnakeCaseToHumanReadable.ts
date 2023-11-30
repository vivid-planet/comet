export function screamingSnakeCaseToHumanReadable(s: string) {
    const words = s.split("_").filter((word) => word.length > 0);
    return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ");
}
