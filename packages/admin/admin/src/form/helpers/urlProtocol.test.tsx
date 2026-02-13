import { isValidElement } from "react";
import { FormattedMessage } from "react-intl";

import { ensureUrlHasProtocol, validateUrl } from "./urlProtocol";

const expectedErrorMessages = {
    missingProtocol: {
        type: FormattedMessage,
        props: {
            id: "comet.validateUrlHasProtocol.missingProtocol",
        },
    },
    invalidEmail: {
        type: FormattedMessage,
        props: {
            id: "comet.validateUrlHasProtocol.invalidEmail",
        },
    },
    invalidPhone: {
        type: FormattedMessage,
        props: {
            id: "comet.validateUrlHasProtocol.invalidPhone",
        },
    },
    invalidUrl: {
        type: FormattedMessage,
        props: {
            id: "comet.validateUrlHasProtocol.invalidUrl",
        },
    },
    protocolNotAllowed: {
        type: FormattedMessage,
        props: {
            id: "comet.validateUrlHasProtocol.protocolNotAllowed",
        },
    },
};

describe("validateUrlHasProtocol", () => {
    describe("empty and undefined values", () => {
        it("returns undefined for empty string", () => {
            expect(validateUrl("")).toBeUndefined();
        });

        it("returns undefined for undefined", () => {
            expect(validateUrl(undefined)).toBeUndefined();
        });

        it("returns undefined for whitespace only", () => {
            expect(validateUrl("   ")).toBeUndefined();
        });
    });

    describe("missing protocol", () => {
        it("returns error message for URLs without protocol", () => {
            const result = validateUrl("example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });

        it("returns error message for URLs with only slashes", () => {
            const result = validateUrl("//example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });

        it("returns error message for plain text", () => {
            const result = validateUrl("just some text");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });

        it("returns error message for email without protocol", () => {
            const result = validateUrl("test@example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });

        it("returns error message for phone number without protocol", () => {
            const result = validateUrl("+1234567890");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });
    });

    describe("mailto: protocol validation", () => {
        it("returns undefined for valid mailto URL with simple email", () => {
            expect(validateUrl("mailto:test@example.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with subdomain", () => {
            expect(validateUrl("mailto:info@subdomain.example.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with numbers", () => {
            expect(validateUrl("mailto:user123@example456.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with special characters", () => {
            expect(validateUrl("mailto:user+tag@example.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with hyphens", () => {
            expect(validateUrl("mailto:user@my-domain.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with dots in local part", () => {
            expect(validateUrl("mailto:first.last@example.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with underscore", () => {
            expect(validateUrl("mailto:user_name@example.com")).toBeUndefined();
        });

        it("returns undefined for valid mailto URL with // prefix (uncommon but technically allowed)", () => {
            expect(validateUrl("mailto://test@example.com")).toBeUndefined();
        });

        it("returns error for invalid mailto URL - missing @", () => {
            const result = validateUrl("mailto:testexample.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });

        it("returns error for invalid mailto URL - missing domain", () => {
            const result = validateUrl("mailto:test@");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });

        it("returns error for invalid mailto URL - missing local part", () => {
            const result = validateUrl("mailto:@example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });

        it("returns error for invalid mailto URL - spaces in email", () => {
            const result = validateUrl("mailto:test @example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });

        it("returns error for invalid mailto URL - multiple @", () => {
            const result = validateUrl("mailto:test@@example.com");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });

        it("returns error for invalid mailto URL - empty", () => {
            const result = validateUrl("mailto:");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidEmail);
        });
    });

    describe("tel: protocol validation", () => {
        it("returns undefined for valid tel URL with international format", () => {
            expect(validateUrl("tel:+1234567890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL without +", () => {
            expect(validateUrl("tel:1234567890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with spaces", () => {
            expect(validateUrl("tel:+1 234 567 890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with dashes", () => {
            expect(validateUrl("tel:+1-234-567-890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with parentheses", () => {
            expect(validateUrl("tel:+1 (234) 567-890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with dots", () => {
            expect(validateUrl("tel:+1.234.567.890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with slashes", () => {
            expect(validateUrl("tel:+1/234/567/890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with mixed formatting", () => {
            expect(validateUrl("tel:+1 (234) 567-890")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with minimum length (7 digits)", () => {
            expect(validateUrl("tel:1234567")).toBeUndefined();
        });

        it("returns undefined for valid tel URL with // prefix", () => {
            expect(validateUrl("tel://+1234567890")).toBeUndefined();
        });

        it("returns error for invalid tel URL - too few digits", () => {
            const result = validateUrl("tel:123456");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidPhone);
        });

        it("returns error for invalid tel URL - empty", () => {
            const result = validateUrl("tel:");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidPhone);
        });

        it("returns error for invalid tel URL - letters", () => {
            const result = validateUrl("tel:+123ABC7890");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidPhone);
        });

        it("returns error for invalid tel URL - only formatting characters", () => {
            const result = validateUrl("tel:+() -./");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.invalidPhone);
        });
    });

    describe("https/http protocol validation", () => {
        describe("valid https URLs", () => {
            it("returns undefined for valid https URL", () => {
                expect(validateUrl("https://example.com")).toBeUndefined();
            });

            it("returns undefined for valid https URL with www", () => {
                expect(validateUrl("https://www.example.com")).toBeUndefined();
            });

            it("returns undefined for valid https URL with subdomain", () => {
                expect(validateUrl("https://api.example.com")).toBeUndefined();
            });

            it("returns undefined for valid https URL with path", () => {
                expect(validateUrl("https://example.com/path")).toBeUndefined();
            });

            it("returns undefined for valid https URL with query parameters", () => {
                expect(validateUrl("https://example.com?param=value")).toBeUndefined();
            });

            it("returns undefined for valid https URL with hash", () => {
                expect(validateUrl("https://example.com#section")).toBeUndefined();
            });

            it("returns undefined for valid https URL with port", () => {
                expect(validateUrl("https://example.com:8080")).toBeUndefined();
            });

            it("returns undefined for valid https URL with IP address", () => {
                expect(validateUrl("https://192.168.1.1")).toBeUndefined();
            });

            it("returns undefined for valid https URL with localhost", () => {
                expect(validateUrl("https://localhost:3000")).toBeUndefined();
            });

            it("returns undefined for valid https URL with complex path", () => {
                expect(validateUrl("https://example.com/path/to/resource?param=value#section")).toBeUndefined();
            });
        });

        describe("valid http URLs", () => {
            it("returns undefined for valid http URL", () => {
                expect(validateUrl("http://example.com")).toBeUndefined();
            });

            it("returns undefined for valid http URL with path", () => {
                expect(validateUrl("http://example.com/page")).toBeUndefined();
            });

            it("returns undefined for valid http URL with port", () => {
                expect(validateUrl("http://localhost:8080")).toBeUndefined();
            });
        });

        describe("invalid https/http URLs", () => {
            it("returns error for invalid https URL - missing domain", () => {
                const result = validateUrl("https://");
                expect(isValidElement(result)).toBe(true);
                expect(result).toMatchObject(expectedErrorMessages.invalidUrl);
            });

            it("returns error for invalid http URL - spaces in domain", () => {
                const result = validateUrl("http://exam ple.com");
                expect(isValidElement(result)).toBe(true);
                expect(result).toMatchObject(expectedErrorMessages.invalidUrl);
            });

            it("returns error for invalid https URL - invalid characters", () => {
                const result = validateUrl("https://exam$ple.com");
                expect(isValidElement(result)).toBe(true);
                expect(result).toMatchObject(expectedErrorMessages.invalidUrl);
            });
        });
    });

    describe("other protocols (just check presence)", () => {
        it("returns undefined for custom protocol with authority", () => {
            expect(validateUrl("custom://example.com")).toBeUndefined();
        });

        it("blocks data URI for security", () => {
            const result = validateUrl("data:text/plain;base64,SGVsbG8=");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks javascript protocol for security", () => {
            const result = validateUrl("javascript:void(0)");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("returns undefined for file protocol", () => {
            expect(validateUrl("file:///path/to/file")).toBeUndefined();
        });

        it("returns undefined for custom protocol without authority", () => {
            expect(validateUrl("myapp:resource")).toBeUndefined();
        });

        it("returns undefined for protocol with special characters", () => {
            expect(validateUrl("custom-protocol+v2.0://example.com")).toBeUndefined();
        });
    });

    describe("whitespace handling", () => {
        it("handles leading whitespace in valid URL", () => {
            expect(validateUrl("  https://example.com")).toBeUndefined();
        });

        it("handles trailing whitespace in valid URL", () => {
            expect(validateUrl("https://example.com  ")).toBeUndefined();
        });

        it("handles whitespace around URL", () => {
            expect(validateUrl("  https://example.com  ")).toBeUndefined();
        });

        it("handles whitespace around invalid URL", () => {
            const result = validateUrl("  example.com  ");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });
    });

    describe("edge cases with port-like patterns", () => {
        it("does not treat localhost:3000 as having a protocol", () => {
            const result = validateUrl("localhost:3000");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });

        it("does not treat domain:port as having a protocol", () => {
            const result = validateUrl("example.com:8080");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.missingProtocol);
        });
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

describe("validateUrl with allowedProtocols", () => {
    describe('allowedProtocols: "web-only"', () => {
        it("allows https URLs", () => {
            expect(validateUrl("https://example.com", "web-only")).toBeUndefined();
        });

        it("allows http URLs", () => {
            expect(validateUrl("http://example.com", "web-only")).toBeUndefined();
        });

        it("blocks mailto URLs", () => {
            const result = validateUrl("mailto:test@example.com", "web-only");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks tel URLs", () => {
            const result = validateUrl("tel:+1234567890", "web-only");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks ftp URLs", () => {
            const result = validateUrl("ftp://example.com", "web-only");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks custom protocols", () => {
            const result = validateUrl("custom://example.com", "web-only");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });
    });

    describe("allowedProtocols: custom array", () => {
        it("allows protocols in the list", () => {
            expect(validateUrl("https://example.com", ["https", "mailto"])).toBeUndefined();
            expect(validateUrl("mailto:test@example.com", ["https", "mailto"])).toBeUndefined();
        });

        it("blocks protocols not in the list", () => {
            const result = validateUrl("http://example.com", ["https", "mailto"]);
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks tel when not in list", () => {
            const result = validateUrl("tel:+1234567890", ["https", "http"]);
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("allows ftp when in list", () => {
            expect(validateUrl("ftp://example.com", ["https", "ftp"])).toBeUndefined();
        });

        it("is case-insensitive for protocols", () => {
            expect(validateUrl("HTTPS://example.com", ["https"])).toBeUndefined();
            expect(validateUrl("https://example.com", ["HTTPS"])).toBeUndefined();
        });
    });

    describe('allowedProtocols: "all" (default)', () => {
        it("allows https", () => {
            expect(validateUrl("https://example.com", "all")).toBeUndefined();
        });

        it("allows http", () => {
            expect(validateUrl("http://example.com", "all")).toBeUndefined();
        });

        it("allows mailto", () => {
            expect(validateUrl("mailto:test@example.com", "all")).toBeUndefined();
        });

        it("allows tel", () => {
            expect(validateUrl("tel:+1234567890", "all")).toBeUndefined();
        });

        it("allows ftp", () => {
            expect(validateUrl("ftp://example.com", "all")).toBeUndefined();
        });

        it("allows custom protocols", () => {
            expect(validateUrl("custom://example.com", "all")).toBeUndefined();
        });

        it("blocks javascript protocol for security", () => {
            const result = validateUrl("javascript:alert(1)", "all");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks data protocol for security", () => {
            const result = validateUrl("data:text/html,<script>alert(1)</script>", "all");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks vbscript protocol for security", () => {
            const result = validateUrl("vbscript:msgbox(1)", "all");
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });
    });

    describe("allowedProtocols: undefined (same as all)", () => {
        it("allows various protocols", () => {
            expect(validateUrl("https://example.com")).toBeUndefined();
            expect(validateUrl("mailto:test@example.com")).toBeUndefined();
            expect(validateUrl("tel:+1234567890")).toBeUndefined();
            expect(validateUrl("ftp://example.com")).toBeUndefined();
        });

        it("blocks dangerous protocols", () => {
            const jsResult = validateUrl("javascript:alert(1)");
            expect(isValidElement(jsResult)).toBe(true);
            expect(jsResult).toMatchObject(expectedErrorMessages.protocolNotAllowed);

            const dataResult = validateUrl("data:text/html,<script>alert(1)</script>");
            expect(isValidElement(dataResult)).toBe(true);
            expect(dataResult).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });
    });

    describe("dangerous protocols always blocked", () => {
        it("blocks javascript even when explicitly allowed", () => {
            const result = validateUrl("javascript:alert(1)", ["javascript", "https"]);
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks data even when explicitly allowed", () => {
            const result = validateUrl("data:text/html,test", ["data", "https"]);
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });

        it("blocks vbscript even when explicitly allowed", () => {
            const result = validateUrl("vbscript:msgbox(1)", ["vbscript", "https"]);
            expect(isValidElement(result)).toBe(true);
            expect(result).toMatchObject(expectedErrorMessages.protocolNotAllowed);
        });
    });
});
