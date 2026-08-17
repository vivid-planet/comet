import type { PublicSiteConfig } from "@src/site-configs";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { withRedirectToMainHostMiddleware } from "./redirectToMainHost";

const { getDomainRedirectDestination, siteConfigs } = vi.hoisted(() => ({
    getDomainRedirectDestination: vi.fn(),
    siteConfigs: [
        {
            name: "Main",
            url: "https://main.example.com",
            domains: {
                main: "main.example.com",
                preliminary: "preliminary.example.com",
                additional: ["additional.example.com", "preview-shared.example.com"],
            },
            scope: { domain: "main", languages: ["en"] },
        },
        {
            name: "Secondary",
            url: "https://secondary.example.com",
            domains: {
                main: "secondary.example.com",
                pattern: "^preview-.*\\.example\\.com$",
            },
            scope: { domain: "secondary", languages: ["en"] },
        },
    ] as PublicSiteConfig[],
}));

vi.mock("./domainRedirects", () => ({ getDomainRedirectDestination }));

/**
 * Mocked as a whole because the real module transitively imports `server-only`, and `getSiteConfigForHost`
 * resolves preview scopes from cookies, which needs a request context.
 */
vi.mock("@src/util/siteConfig", () => ({
    getHostByHeaders: (headers: Headers) => headers.get("x-forwarded-host") ?? headers.get("host"),
    getSiteConfigs: () => siteConfigs,
    getSiteConfigForHost: async (host: string) =>
        siteConfigs.find((siteConfig) => siteConfig.domains.main === host || siteConfig.domains.preliminary === host),
}));

const renderPage = vi.fn(async () => new Response("rendered page"));

const middleware = withRedirectToMainHostMiddleware(renderPage);

function createRequest(host: string, path = "/") {
    return new NextRequest(`https://request.example.com${path}`, { headers: { "x-forwarded-host": host } });
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
    renderPage.mockClear();
    getDomainRedirectDestination.mockReset();
    getDomainRedirectDestination.mockResolvedValue(undefined);
    consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("withRedirectToMainHostMiddleware", () => {
    describe("hosts a site config claims", () => {
        it.each(["main.example.com", "preliminary.example.com", "secondary.example.com"])("passes %s on to the next middleware", async (host) => {
            const response = await middleware(createRequest(host));

            expect(renderPage).toHaveBeenCalledOnce();
            expect(await response.text()).toBe("rendered page");
        });

        it("does not look up domain redirects for a known host", async () => {
            await middleware(createRequest("main.example.com"));

            expect(getDomainRedirectDestination).not.toHaveBeenCalled();
        });
    });

    describe("domain redirects", () => {
        it("redirects permanently to the domain redirect's destination", async () => {
            getDomainRedirectDestination.mockResolvedValue("https://main.example.com/en/products");

            const response = await middleware(createRequest("old.example.com"));

            expect(response.status).toBe(301);
            expect(response.headers.get("location")).toBe("https://main.example.com/en/products");
            expect(renderPage).not.toHaveBeenCalled();
        });

        it("looks the redirect up by canonical host", async () => {
            await middleware(createRequest("OLD.EXAMPLE.COM."));

            expect(getDomainRedirectDestination).toHaveBeenCalledWith("old.example.com");
        });

        it("takes precedence over the redirect to the main host", async () => {
            getDomainRedirectDestination.mockResolvedValue("https://elsewhere.example.org/landing");

            const response = await middleware(createRequest("additional.example.com"));

            expect(response.headers.get("location")).toBe("https://elsewhere.example.org/landing");
        });

        it("falls back to the main host when the destination is the current host", async () => {
            getDomainRedirectDestination.mockResolvedValue("https://additional.example.com/somewhere");

            const response = await middleware(createRequest("additional.example.com"));

            expect(response.status).toBe(301);
            expect(response.headers.get("location")).toBe("https://main.example.com/");
            expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("would redirect to itself"));
        });

        it("responds with 404 when the destination is the current host and no site config matches", async () => {
            getDomainRedirectDestination.mockResolvedValue("https://old.example.com/somewhere");

            const response = await middleware(createRequest("old.example.com"));

            expect(response.status).toBe(404);
            expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("would redirect to itself"));
        });

        it("responds with 404 when the destination is not an absolute URL", async () => {
            getDomainRedirectDestination.mockResolvedValue("/en/products");

            const response = await middleware(createRequest("old.example.com"));

            expect(response.status).toBe(404);
            expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("not an absolute URL"));
        });
    });

    describe("redirect to the main host", () => {
        it.each([
            ["an additional domain", "additional.example.com", "https://main.example.com/"],
            ["an additional domain in upper case", "ADDITIONAL.EXAMPLE.COM", "https://main.example.com/"],
            ["a fully-qualified additional domain", "additional.example.com.", "https://main.example.com/"],
            ["the www variant of an additional domain", "www.additional.example.com", "https://main.example.com/"],
            ["the www variant of the main domain", "www.main.example.com", "https://main.example.com/"],
            ["a host matching the pattern", "preview-abc.example.com", "https://secondary.example.com/"],
            ["a host matching the pattern in upper case", "PREVIEW-ABC.EXAMPLE.COM", "https://secondary.example.com/"],
        ])("redirects %s permanently to the main host", async (description, host, expectedLocation) => {
            const response = await middleware(createRequest(host));

            expect(response.status).toBe(301);
            expect(response.headers.get("location")).toBe(expectedLocation);
        });

        it("keeps path and query", async () => {
            const response = await middleware(createRequest("additional.example.com", "/en/nested?a=1&b=2"));

            expect(response.headers.get("location")).toBe("https://main.example.com/en/nested?a=1&b=2");
        });

        it("prefers a configured additional domain over another site config's pattern", async () => {
            const response = await middleware(createRequest("preview-shared.example.com"));

            expect(response.headers.get("location")).toBe("https://main.example.com/");
        });
    });

    describe("hosts that cannot be resolved", () => {
        it("responds with 404 and names the host", async () => {
            const response = await middleware(createRequest("nowhere.example.org"));

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ error: "Cannot resolve domain: nowhere.example.org" });
            expect(renderPage).not.toHaveBeenCalled();
        });
    });
});
