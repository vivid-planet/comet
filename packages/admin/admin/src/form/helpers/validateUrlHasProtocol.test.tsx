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
        expect(validateUrlHasProtocol("example.com")).toBe("URL must include a protocol (e.g., https://, http://, mailto:)");
    });

    it("returns error message for URLs with only slashes", () => {
        expect(validateUrlHasProtocol("//example.com")).toBe("URL must include a protocol (e.g., https://, http://, mailto:)");
    });

    it("returns error message for plain text", () => {
        expect(validateUrlHasProtocol("just some text")).toBe("URL must include a protocol (e.g., https://, http://, mailto:)");
    });

    it("handles whitespace correctly", () => {
        expect(validateUrlHasProtocol("  https://example.com  ")).toBeUndefined();
        expect(validateUrlHasProtocol("  example.com  ")).toBe("URL must include a protocol (e.g., https://, http://, mailto:)");
    });
});
