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

    it("adds https protocol for localhost without port", () => {
        expect(ensureUrlHasProtocol("localhost")).toBe("https://localhost");
    });

    it("removes leading slashes before adding https", () => {
        expect(ensureUrlHasProtocol("//example.com")).toBe("https://example.com");
    });

    it("adds https protocol for IP addresses", () => {
        expect(ensureUrlHasProtocol("192.168.1.1")).toBe("https://192.168.1.1");
        expect(ensureUrlHasProtocol("192.168.1.1:8080")).toBe("https://192.168.1.1:8080");
    });

    it("does not add https protocol to invalid URL structures", () => {
        expect(ensureUrlHasProtocol("just some text")).toBe("just some text");
        expect(ensureUrlHasProtocol("no-dots-here")).toBe("no-dots-here");
        expect(ensureUrlHasProtocol("single")).toBe("single");
    });

    it("does not add https protocol to email addresses without protocol", () => {
        expect(ensureUrlHasProtocol("test@example.com")).toBe("test@example.com");
    });
});
