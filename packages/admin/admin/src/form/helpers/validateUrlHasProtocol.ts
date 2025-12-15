export const validateUrlHasProtocol = (value: string | undefined): string | undefined => {
    if (!value || value.trim() === "") {
        return undefined;
    }

    const trimmedValue = value.trim();
    const schemeMatch = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/.exec(trimmedValue);

    if (!schemeMatch) {
        return "URL must include a protocol (e.g., https://, http://, mailto:)";
    }

    return undefined;
};
