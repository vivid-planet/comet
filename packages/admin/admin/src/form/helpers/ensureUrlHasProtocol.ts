export const ensureUrlHasProtocol = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
        return trimmedValue;
    }

    const schemeMatch = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/.exec(trimmedValue);

    if (schemeMatch) {
        const rest = schemeMatch[2];
        const hasAuthority = rest.startsWith("//");
        const isLikelyPort = /^[0-9]/.test(rest);

        if (hasAuthority || !isLikelyPort) {
            return trimmedValue;
        }
    }

    const sanitizedValue = trimmedValue.replace(/^\/\//, "");

    return `https://${sanitizedValue}`;
};
