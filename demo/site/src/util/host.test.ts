import { describe, expect, it } from "vitest";

import { canonicalizeHost, removeWww } from "./host";

describe("canonicalizeHost", () => {
    it.each([
        ["example.com", "example.com"],
        ["EXAMPLE.COM", "example.com"],
        ["Example.Com", "example.com"],
        ["example.com.", "example.com"],
        ["https://example.com", "example.com"],
        ["http://example.com", "example.com"],
        ["https://example.com/", "example.com"],
        ["https://example.com/some/path", "example.com"],
        ["https://example.com/path?query=1#hash", "example.com"],
        ["http://example.com:80", "example.com"],
        ["https://example.com:443", "example.com"],
        ["example.com:8080", "example.com:8080"],
        ["localhost:3000", "localhost:3000"],
        ["www.example.com", "www.example.com"],
        ["täst.example.com", "xn--tst-qla.example.com"],
    ])("canonicalizes %s to %s", (hostOrUrl, expected) => {
        expect(canonicalizeHost(hostOrUrl)).toBe(expected);
    });

    it("treats every notation of the same host as equal", () => {
        const expected = canonicalizeHost("example.com");

        expect(canonicalizeHost("EXAMPLE.COM.")).toBe(expected);
        expect(canonicalizeHost("https://Example.com/")).toBe(expected);
        expect(canonicalizeHost("https://example.com:443/path")).toBe(expected);
    });

    it("falls back to the lowercased value when it cannot be parsed as a URL", () => {
        expect(canonicalizeHost(" NOT A HOST ")).toBe("not a host");
    });
});

describe("removeWww", () => {
    it("removes a leading www", () => {
        expect(removeWww("www.example.com")).toBe("example.com");
    });

    it("keeps hosts that don't start with www", () => {
        expect(removeWww("example.com")).toBe("example.com");
        expect(removeWww("wwwx.example.com")).toBe("wwwx.example.com");
        expect(removeWww("shop.www.example.com")).toBe("shop.www.example.com");
    });
});
