import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { isEmail, isURL } from "validator";

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

    const protocol = schemeMatch[1];
    const rest = schemeMatch[2];
    const hasAuthority = rest.startsWith("//");
    const isLikelyPort = protocol !== "tel" && /^[0-9]/.test(rest); // to handle edge cases like localhost:3000 where localhost isn't the protocol

    return hasAuthority || !isLikelyPort;
};

const cleanPhoneNumber = (value: string): string => value.replace(patterns.phoneFormatChars, "");

/**
 * Validates that a URL has a protocol. Returns an error message if the protocol is missing or invalid.
 * Used for form validation in UrlField.
 *
 * Validation rules:
 * - mailto: validates the email part using validator.isEmail
 * - tel: validates the phone part using the phone regex
 * - https/http: validates using validator.isURL
 * - other protocols: just checks if a protocol is present
 */
export const validateUrl = (value: string | undefined): ReactNode | undefined => {
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

    // Extract protocol and the rest of the URL
    const protocolMatch = /^([a-zA-Z][a-zA-Z\d+.-]*):(.*)$/.exec(trimmedValue);
    if (!protocolMatch) {
        return (
            <FormattedMessage
                id="comet.validateUrlHasProtocol.missingProtocol"
                defaultMessage="URL must include a protocol (e.g., https://, http://, mailto:, tel:)"
            />
        );
    }

    const protocol = protocolMatch[1].toLowerCase();
    const rest = protocolMatch[2];

    // Validate mailto:
    if (protocol === "mailto") {
        const emailPart = rest.replace(/^\/\//, ""); // Remove optional //
        if (!isEmail(emailPart)) {
            return <FormattedMessage id="comet.validateUrlHasProtocol.invalidEmail" defaultMessage="Invalid email address" />;
        }
        return undefined;
    }

    // Validate tel:
    if (protocol === "tel") {
        const phonePart = rest.replace(/^\/\//, ""); // Remove optional //
        const cleaned = cleanPhoneNumber(phonePart);
        if (!patterns.phone.test(cleaned)) {
            return <FormattedMessage id="comet.validateUrlHasProtocol.invalidPhone" defaultMessage="Invalid phone number" />;
        }
        return undefined;
    }

    // Validate https, http:
    if (protocol === "https" || protocol === "http") {
        const urlPart = rest.replace(/^\/\//, ""); // Remove optional //
        if (
            !isURL(trimmedValue, {
                protocols: ["https", "http"],
                require_protocol: true,
                require_tld: !urlPart.startsWith("localhost"),
            })
        ) {
            return <FormattedMessage id="comet.validateUrlHasProtocol.invalidUrl" defaultMessage="Invalid URL" />;
        }
        return undefined;
    }

    // For all other protocols, just check that a protocol is present (already verified above)
    return undefined;
};

const isValidUrlStructure = (value: string): boolean => {
    // Check for domain-like structure: at least one dot or localhost
    // Examples: example.com, sub.example.com, localhost, localhost:3000
    // Also accept IP addresses
    return patterns.domain.test(value) || patterns.ip.test(value);
};

const isEmailPattern = (value: string): boolean => patterns.email.test(value);

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
    if (isEmailPattern(trimmedValue)) {
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
