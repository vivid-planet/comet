import { isValidElement } from "react";
import { FormattedMessage } from "react-intl";

import { validateUrlHasProtocol } from "./validateUrlHasProtocol";

describe("validateUrlHasProtocol", () => {
    it("returns undefined for empty string", () => {
        expect(validateUrlHasProtocol("")).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
        expect(validateUrlHasProtocol(undefined)).toBeUndefined();
    });

    it("returns undefined for URLs with https protocol", () => {
        expect(validateUrlHasProtocol("https://example.com")).toBeUndefined();
    });

    it("returns undefined for URLs with http protocol", () => {
        expect(validateUrlHasProtocol("http://example.com")).toBeUndefined();
    });

    it("returns undefined for URLs with mailto protocol", () => {
        expect(validateUrlHasProtocol("mailto:test@example.com")).toBeUndefined();
    });

    it("returns undefined for URLs with ftp protocol", () => {
        expect(validateUrlHasProtocol("ftp://example.com")).toBeUndefined();
    });

    it("returns error message for URLs without protocol", () => {
        const result = validateUrlHasProtocol("example.com");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject({
            type: FormattedMessage,
            props: {
                id: "comet.validateUrlHasProtocol.missingProtocol",
                defaultMessage: "URL must include a protocol (e.g., https://, http://, mailto:, tel:)",
            },
        });
    });

    it("returns error message for URLs with only slashes", () => {
        const result = validateUrlHasProtocol("//example.com");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject({
            type: FormattedMessage,
            props: {
                id: "comet.validateUrlHasProtocol.missingProtocol",
                defaultMessage: "URL must include a protocol (e.g., https://, http://, mailto:, tel:)",
            },
        });
    });

    it("returns error message for plain text", () => {
        const result = validateUrlHasProtocol("just some text");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject({
            type: FormattedMessage,
            props: {
                id: "comet.validateUrlHasProtocol.missingProtocol",
                defaultMessage: "URL must include a protocol (e.g., https://, http://, mailto:, tel:)",
            },
        });
    });

    it("handles whitespace correctly", () => {
        expect(validateUrlHasProtocol("  https://example.com  ")).toBeUndefined();
        const result = validateUrlHasProtocol("  example.com  ");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject({
            type: FormattedMessage,
            props: {
                id: "comet.validateUrlHasProtocol.missingProtocol",
                defaultMessage: "URL must include a protocol (e.g., https://, http://, mailto:, tel:)",
            },
        });
    });
});
