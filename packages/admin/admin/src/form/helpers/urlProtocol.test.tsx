import { isValidElement } from "react";
import { FormattedMessage } from "react-intl";

import { ensureUrlHasProtocol, validateUrlHasProtocol } from "./urlProtocol";

const expectedErrorMessage = {
    type: FormattedMessage,
    props: {
        id: "comet.validateUrlHasProtocol.missingProtocol",
    },
};

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
        expect(result).toMatchObject(expectedErrorMessage);
    });

    it("returns error message for URLs with only slashes", () => {
        const result = validateUrlHasProtocol("//example.com");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject(expectedErrorMessage);
    });

    it("returns error message for plain text", () => {
        const result = validateUrlHasProtocol("just some text");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject(expectedErrorMessage);
    });

    it("handles whitespace correctly", () => {
        expect(validateUrlHasProtocol("  https://example.com  ")).toBeUndefined();
        const result = validateUrlHasProtocol("  example.com  ");
        expect(isValidElement(result)).toBe(true);
        expect(result).toMatchObject(expectedErrorMessage);
    });
});

describe("ensureUrlHasProtocol", () => {
    describe("empty and whitespace inputs", () => {
        it("returns empty string unchanged", () => {
            expect(ensureUrlHasProtocol("")).toBe("");
        });

        it("trims whitespace and processes value", () => {
            expect(ensureUrlHasProtocol("  example.com  ")).toBe("https://example.com");
        });

        it("returns empty string when only whitespace", () => {
            expect(ensureUrlHasProtocol("   ")).toBe("");
        });
    });

    describe("URLs with existing protocols (with authority)", () => {
        it("keeps existing https protocol", () => {
            expect(ensureUrlHasProtocol("https://example.com")).toBe("https://example.com");
        });

        it("keeps existing http protocol", () => {
            expect(ensureUrlHasProtocol("http://example.com")).toBe("http://example.com");
        });

        it("keeps ftp protocol", () => {
            expect(ensureUrlHasProtocol("ftp://example.com")).toBe("ftp://example.com");
        });

        it("keeps file protocol", () => {
            expect(ensureUrlHasProtocol("file:///path/to/file")).toBe("file:///path/to/file");
        });

        it("keeps protocol with complex schema names", () => {
            expect(ensureUrlHasProtocol("custom-protocol+v2.0://example.com")).toBe("custom-protocol+v2.0://example.com");
        });
    });

    describe("URIs with protocols (without authority - opaque URIs)", () => {
        it("keeps mailto protocol", () => {
            expect(ensureUrlHasProtocol("mailto:test@example.com")).toBe("mailto:test@example.com");
        });

        it("keeps tel protocol", () => {
            expect(ensureUrlHasProtocol("tel:+1234567890")).toBe("tel:+1234567890");
        });

        it("keeps data URI", () => {
            expect(ensureUrlHasProtocol("data:text/plain;base64,SGVsbG8=")).toBe("data:text/plain;base64,SGVsbG8=");
        });

        it("keeps javascript protocol", () => {
            expect(ensureUrlHasProtocol("javascript:void(0)")).toBe("javascript:void(0)");
        });
    });

    describe("domain:port combinations (isLikelyPort branch)", () => {
        it("adds https protocol for localhost with port", () => {
            expect(ensureUrlHasProtocol("localhost:3000")).toBe("https://localhost:3000");
        });

        it("adds https protocol for domain with port", () => {
            expect(ensureUrlHasProtocol("example.com:8080")).toBe("https://example.com:8080");
        });

        it("adds https protocol for IP with port", () => {
            expect(ensureUrlHasProtocol("192.168.1.1:8080")).toBe("https://192.168.1.1:8080");
        });

        it("adds https protocol for subdomain with port", () => {
            expect(ensureUrlHasProtocol("api.example.com:3000")).toBe("https://api.example.com:3000");
        });
    });

    describe("phone number detection and conversion", () => {
        it("adds tel protocol to phone numbers", () => {
            expect(ensureUrlHasProtocol("+1234567890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to phone numbers with spaces", () => {
            expect(ensureUrlHasProtocol("+1 234 567 890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to phone numbers with dashes", () => {
            expect(ensureUrlHasProtocol("+1-234-567-890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to phone numbers with parentheses", () => {
            expect(ensureUrlHasProtocol("+1 (234) 567-890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to phone numbers with dots", () => {
            expect(ensureUrlHasProtocol("+1.234.567.890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to phone numbers with slashes", () => {
            expect(ensureUrlHasProtocol("+1/234/567/890")).toBe("tel:+1234567890");
        });

        it("adds tel protocol to international format without +", () => {
            expect(ensureUrlHasProtocol("1234567890")).toBe("tel:1234567890");
        });

        it("does not treat short numbers as phone numbers", () => {
            expect(ensureUrlHasProtocol("123456")).toBe("123456");
        });

        it("handles minimum valid phone number length (7 digits)", () => {
            expect(ensureUrlHasProtocol("1234567")).toBe("tel:1234567");
        });
    });

    describe("email detection and conversion", () => {
        it("adds mailto protocol to email addresses without protocol", () => {
            expect(ensureUrlHasProtocol("test@example.com")).toBe("mailto:test@example.com");
        });

        it("adds mailto protocol to emails with subdomains", () => {
            expect(ensureUrlHasProtocol("info@subdomain.example.co.uk")).toBe("mailto:info@subdomain.example.co.uk");
        });

        it("adds mailto protocol to emails with special characters", () => {
            expect(ensureUrlHasProtocol("user+tag@example.com")).toBe("mailto:user+tag@example.com");
        });

        it("adds mailto protocol to emails with numbers", () => {
            expect(ensureUrlHasProtocol("user123@example456.com")).toBe("mailto:user123@example456.com");
        });
    });

    describe("domain URLs without protocol", () => {
        it("adds https protocol when missing", () => {
            expect(ensureUrlHasProtocol("example.com")).toBe("https://example.com");
        });

        it("adds https protocol for subdomain", () => {
            expect(ensureUrlHasProtocol("www.example.com")).toBe("https://www.example.com");
        });

        it("adds https protocol for multi-level subdomain", () => {
            expect(ensureUrlHasProtocol("api.dev.example.com")).toBe("https://api.dev.example.com");
        });

        it("adds https protocol for domain with path", () => {
            expect(ensureUrlHasProtocol("example.com/path")).toBe("https://example.com/path");
        });

        it("adds https protocol for TLDs with multiple parts", () => {
            expect(ensureUrlHasProtocol("example.co.uk")).toBe("https://example.co.uk");
        });

        it("adds https protocol for localhost without port", () => {
            expect(ensureUrlHasProtocol("localhost")).toBe("https://localhost");
        });
    });

    describe("IP addresses", () => {
        it("adds https protocol for IP addresses", () => {
            expect(ensureUrlHasProtocol("192.168.1.1")).toBe("https://192.168.1.1");
        });

        it("adds https protocol for IP with port", () => {
            expect(ensureUrlHasProtocol("192.168.1.1:8080")).toBe("https://192.168.1.1:8080");
        });

        it("adds https protocol for IP with path", () => {
            expect(ensureUrlHasProtocol("192.168.1.1/admin")).toBe("https://192.168.1.1/admin");
        });

        it("adds https protocol for localhost IP", () => {
            expect(ensureUrlHasProtocol("127.0.0.1")).toBe("https://127.0.0.1");
        });

        it("adds https protocol for public IP", () => {
            expect(ensureUrlHasProtocol("8.8.8.8")).toBe("https://8.8.8.8");
        });
    });

    describe("leading slashes removal", () => {
        it("removes leading slashes before adding https", () => {
            expect(ensureUrlHasProtocol("//example.com")).toBe("https://example.com");
        });

        it("removes leading slashes from localhost", () => {
            expect(ensureUrlHasProtocol("//localhost:3000")).toBe("https://localhost:3000");
        });

        it("removes leading slashes from IP", () => {
            expect(ensureUrlHasProtocol("//192.168.1.1")).toBe("https://192.168.1.1");
        });
    });

    describe("invalid URL structures", () => {
        it("does not add https protocol to invalid URL structures", () => {
            expect(ensureUrlHasProtocol("just some text")).toBe("just some text");
        });

        it("returns single word unchanged", () => {
            expect(ensureUrlHasProtocol("single")).toBe("single");
        });

        it("returns hyphenated word without dots unchanged", () => {
            expect(ensureUrlHasProtocol("no-dots-here")).toBe("no-dots-here");
        });

        it("returns text with spaces unchanged", () => {
            expect(ensureUrlHasProtocol("not a url at all")).toBe("not a url at all");
        });

        it("returns partial domain unchanged", () => {
            expect(ensureUrlHasProtocol("example")).toBe("example");
        });

        it("returns invalid characters unchanged", () => {
            expect(ensureUrlHasProtocol("invalid url!")).toBe("invalid url!");
        });
    });

    describe("edge cases", () => {
        it("handles URLs with query parameters", () => {
            expect(ensureUrlHasProtocol("example.com?param=value")).toBe("https://example.com?param=value");
        });

        it("handles URLs with hash fragments", () => {
            expect(ensureUrlHasProtocol("example.com#section")).toBe("https://example.com#section");
        });

        it("handles URLs with both query and hash", () => {
            expect(ensureUrlHasProtocol("example.com?param=value#section")).toBe("https://example.com?param=value#section");
        });

        it("handles mixed case domains", () => {
            expect(ensureUrlHasProtocol("Example.COM")).toBe("https://Example.COM");
        });

        it("handles domains with hyphens", () => {
            expect(ensureUrlHasProtocol("my-example-site.com")).toBe("https://my-example-site.com");
        });

        it("handles domains with numbers", () => {
            expect(ensureUrlHasProtocol("example123.com")).toBe("https://example123.com");
        });

        it("handles protocol-like prefix that is actually valid", () => {
            expect(ensureUrlHasProtocol("custom:value")).toBe("custom:value");
        });
    });
});
