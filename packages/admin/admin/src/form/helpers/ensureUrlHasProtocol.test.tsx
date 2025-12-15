import { ensureUrlHasProtocol } from "./ensureUrlHasProtocol";

describe("ensureUrlHasProtocol", () => {
    it("adds https protocol when missing", () => {
        expect(ensureUrlHasProtocol("example.com")).toBe("https://example.com");
    });

    it("keeps existing https protocol", () => {
        expect(ensureUrlHasProtocol("https://example.com")).toBe("https://example.com");
    });

    it("keeps mailto protocol", () => {
        expect(ensureUrlHasProtocol("mailto:test@example.com")).toBe("mailto:test@example.com");
    });

    it("keeps ftp protocol", () => {
        expect(ensureUrlHasProtocol("ftp://example.com")).toBe("ftp://example.com");
    });

    it("adds https protocol for localhost with port", () => {
        expect(ensureUrlHasProtocol("localhost:3000")).toBe("https://localhost:3000");
    });

    it("removes leading slashes before adding https", () => {
        expect(ensureUrlHasProtocol("//example.com")).toBe("https://example.com");
    });
});
