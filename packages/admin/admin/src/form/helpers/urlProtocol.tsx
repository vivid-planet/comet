import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

const patterns = {
    domain: /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|^localhost(:[0-9]+)?$/,
    ip: /^(\d{1,3}\.){3}\d{1,3}(:[0-9]+)?(\/.*)?$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9]{7,}$/,
    phoneFormatChars: /[\s\-()./]/g,
} as const;

const hasProtocol = (value: string): boolean => {
    const hasProtocolRegex = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/;
    const schemeMatch = hasProtocolRegex.exec(value);

    if (!schemeMatch) {
        return false;
    }

    const rest = schemeMatch[2];
    const hasAuthority = rest.startsWith("//");
    const isLikelyPort = /^[0-9]/.test(rest); // to handle edge cases like localhost:3000 where localhost isn't the protocol

    return hasAuthority || !isLikelyPort;
};

/**
 * Validates that a URL has a protocol. Returns an error message if the protocol is missing.
 * Used for form validation in UrlField.
 */
export const validateUrlHasProtocol = (value: string | undefined): ReactNode | undefined => {
    if (!value || value.trim() === "") {
        return undefined;
    }

    const trimmedValue = value.trim();

    if (!hasProtocol(trimmedValue)) {
        return (
            <FormattedMessage
                id="comet.validateUrlHasProtocol.missingProtocol"
                defaultMessage="URL must include a protocol (e.g., https://, http://, mailto:, tel:)"
            />
        );
    }

    return undefined;
};

const cleanPhoneNumber = (value: string): string => value.replace(patterns.phoneFormatChars, "");

const isValidUrlStructure = (value: string): boolean => {
    // Check for domain-like structure: at least one dot or localhost
    // Examples: example.com, sub.example.com, localhost, localhost:3000
    // Also accept IP addresses
    return patterns.domain.test(value) || patterns.ip.test(value);
};

const isEmail = (value: string): boolean => patterns.email.test(value);

const isPhoneNumber = (value: string): boolean => {
    // Check if it starts with + (international format) or is all digits
    // Must have at least 7 digits (minimum for a valid phone number)
    const cleaned = cleanPhoneNumber(value);
    return patterns.phone.test(cleaned);
};

/**
 * Ensures a URL has a protocol by adding one if missing.
 * Automatically detects the appropriate protocol based on the input:
 * - Adds "mailto:" for email addresses
 * - Adds "tel:" for phone numbers
 * - Adds "https://" for domains and IP addresses
 */
export const ensureUrlHasProtocol = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
        return trimmedValue;
    }

    if (hasProtocol(trimmedValue)) {
        return trimmedValue;
    }

    // Check for email first (contains @)
    if (isEmail(trimmedValue)) {
        return `mailto:${trimmedValue}`;
    }

    // Check for valid URL structures (domains and IPs) next to prevent IPs from being misidentified as phone numbers
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
