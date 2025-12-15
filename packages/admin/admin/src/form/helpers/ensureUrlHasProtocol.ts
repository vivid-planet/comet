const isValidUrlStructure = (value: string): boolean => {
    // Check for domain-like structure: at least one dot or localhost
    // Examples: example.com, sub.example.com, localhost, localhost:3000
    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|^localhost(:[0-9]+)?$/;

    // Also accept IP addresses
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(:[0-9]+)?$/;

    return domainPattern.test(value) || ipPattern.test(value);
};

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

    // Only add https:// if the value looks like a valid URL
    if (!isValidUrlStructure(sanitizedValue)) {
        return trimmedValue;
    }

    return `https://${sanitizedValue}`;
};
