const PATTERNS = {
    domain: /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|^localhost(:[0-9]+)?$/,
    ip: /^(\d{1,3}\.){3}\d{1,3}(:[0-9]+)?(\/.*)?$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9]{7,}$/,
    phoneFormatChars: /[\s\-()./]/g,
} as const;

const cleanPhoneNumber = (value: string): string => value.replace(PATTERNS.phoneFormatChars, "");

const isValidUrlStructure = (value: string): boolean => {
    // Check for domain-like structure: at least one dot or localhost
    // Examples: example.com, sub.example.com, localhost, localhost:3000
    // Also accept IP addresses
    return PATTERNS.domain.test(value) || PATTERNS.ip.test(value);
};

const isEmail = (value: string): boolean => PATTERNS.email.test(value);

const isPhoneNumber = (value: string): boolean => {
    // Check if it starts with + (international format) or is all digits
    // Must have at least 7 digits (minimum for a valid phone number)
    const cleaned = cleanPhoneNumber(value);
    return PATTERNS.phone.test(cleaned);
};

export const ensureUrlHasProtocol = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
        return trimmedValue;
    }

    const hasProtocolMatch = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/.exec(trimmedValue);

    if (hasProtocolMatch) {
        const rest = hasProtocolMatch[2];
        const hasAuthority = rest.startsWith("//");
        const isLikelyPort = /^[0-9]/.test(rest); // to handle edge cases like localhost:3000 where localhost isn't the protocol

        if (hasAuthority || !isLikelyPort) {
            return trimmedValue;
        }
    }

    // Check for email first (contains @)
    if (isEmail(trimmedValue)) {
        return `mailto:${trimmedValue}`;
    }

    // Check for valid URL structures (domains and IPs) before phone numbers
    // This prevents IPs from being misidentified as phone numbers
    const sanitizedValue = trimmedValue.replace(/^\/\//, "");
    if (isValidUrlStructure(sanitizedValue)) {
        return `https://${sanitizedValue}`;
    }

    // Check for phone numbers last
    if (isPhoneNumber(trimmedValue)) {
        return `tel:${cleanPhoneNumber(trimmedValue)}`;
    }

    return trimmedValue;
};
