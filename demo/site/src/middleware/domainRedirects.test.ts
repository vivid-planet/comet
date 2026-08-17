import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDomainRedirectDestination } from "./domainRedirects";

type TestRedirect = {
    source: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any;
    active: boolean;
};

const { graphQLFetch, siteConfigs } = vi.hoisted(() => ({
    graphQLFetch: vi.fn(),
    siteConfigs: [] as { scope: { domain: string }; domains: { main: string } }[],
}));

// Importing the package barrel for `gql` alone would pull in its React components.
vi.mock("@dextinity/site-nextjs", () => ({
    gql: (strings: TemplateStringsArray, ...values: unknown[]) => strings.raw.reduce((query, part, index) => query + values[index - 1] + part),
}));

vi.mock("@src/util/graphQLClientMiddleware", () => ({
    createGraphQLFetchMiddleware: () => graphQLFetch,
}));

// The real cache would leak redirects from one test case into the next.
vi.mock("./cache", () => ({
    memoryCache: { wrap: (key: string, fetchValue: () => unknown) => fetchValue() },
}));

vi.mock("@src/util/siteConfig", () => ({
    getSiteConfigs: () => siteConfigs,
}));

function setSiteConfigs(...domains: string[]) {
    siteConfigs.length = 0;
    siteConfigs.push(...domains.map((domain) => ({ scope: { domain }, domains: { main: `${domain}.example.com` } })));
}

function setRedirects(redirectsByDomain: Record<string, TestRedirect[]>) {
    graphQLFetch.mockImplementation(async (query, variables) => {
        const redirects = redirectsByDomain[variables.scope.domain] ?? [];
        return {
            paginatedRedirects: {
                nodes: redirects.slice(variables.offset, variables.offset + variables.limit),
                totalCount: redirects.length,
            },
        };
    });
}

const internalTarget = (path: string, language = "en") => ({
    block: { type: "internal", props: { targetPage: { path, scope: { domain: "main", language } } } },
});

const newsTarget = (slug: string, language = "en") => ({
    block: { type: "news", props: { news: { id: "news-id", slug, scope: { domain: "main", language } } } },
});

const externalTarget = (targetUrl: string) => ({ block: { type: "external", props: { targetUrl } } });

const activeRedirect = (source: string, target: unknown): TestRedirect => ({ source, target, active: true });

beforeEach(() => {
    graphQLFetch.mockReset();
    setSiteConfigs("main");
});

describe("getDomainRedirectDestination", () => {
    it("resolves an internal target to an absolute URL on the main domain of the redirect's site config", async () => {
        setRedirects({ main: [activeRedirect("old.example.com", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://main.example.com/en/products");
    });

    it("resolves a news target to an absolute URL", async () => {
        setRedirects({ main: [activeRedirect("news.example.com", newsTarget("some-news"))] });

        await expect(getDomainRedirectDestination("news.example.com")).resolves.toBe("https://main.example.com/en/news/some-news");
    });

    it("passes an external target through unchanged", async () => {
        setRedirects({ main: [activeRedirect("old.example.com", externalTarget("https://elsewhere.example.org/landing"))] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://elsewhere.example.org/landing");
    });

    it("returns undefined for a host without a domain redirect", async () => {
        setRedirects({ main: [activeRedirect("old.example.com", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("unrelated.example.com")).resolves.toBeUndefined();
    });

    it("ignores deactivated redirects", async () => {
        setRedirects({ main: [{ source: "old.example.com", target: internalTarget("/products"), active: false }] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBeUndefined();
    });

    it("matches a source that was stored with a scheme and a trailing slash", async () => {
        setRedirects({ main: [activeRedirect("https://old.example.com/", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://main.example.com/en/products");
    });

    it("matches a source that was stored with different casing", async () => {
        setRedirects({ main: [activeRedirect("OLD.EXAMPLE.COM", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://main.example.com/en/products");
    });

    it("falls back to the source without www for a www host", async () => {
        setRedirects({ main: [activeRedirect("old.example.com", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("www.old.example.com")).resolves.toBe("https://main.example.com/en/products");
    });

    it("prefers an exact source over the source without www", async () => {
        setRedirects({
            main: [activeRedirect("www.old.example.com", internalTarget("/www-page")), activeRedirect("old.example.com", internalTarget("/page"))],
        });

        await expect(getDomainRedirectDestination("www.old.example.com")).resolves.toBe("https://main.example.com/en/www-page");
    });

    it("builds the target URL from the main domain of the scope the redirect belongs to", async () => {
        setSiteConfigs("main", "secondary");
        setRedirects({ secondary: [activeRedirect("old.example.com", internalTarget("/products"))] });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://secondary.example.com/en/products");
    });

    it("lets the first site config win when two scopes define the same source", async () => {
        setSiteConfigs("main", "secondary");
        setRedirects({
            main: [activeRedirect("old.example.com", internalTarget("/from-main"))],
            secondary: [activeRedirect("old.example.com", internalTarget("/from-secondary"))],
        });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://main.example.com/en/from-main");
    });

    it("stops paginating when a page returns no nodes although totalCount promises more", async () => {
        // Without a page limit an endless pagination loop would starve the event loop and hang instead of failing.
        const maxPages = 5;
        graphQLFetch.mockImplementation(async (query, variables) => {
            if (graphQLFetch.mock.calls.length > maxPages) {
                throw new Error(`Requested more than ${maxPages} pages, pagination does not terminate`);
            }
            return {
                paginatedRedirects: {
                    nodes: variables.offset === 0 ? [activeRedirect("old.example.com", internalTarget("/products"))] : [],
                    totalCount: 5000,
                },
            };
        });

        await expect(getDomainRedirectDestination("old.example.com")).resolves.toBe("https://main.example.com/en/products");
        expect(graphQLFetch).toHaveBeenCalledTimes(2);
    });

    it("requests only domain redirects", async () => {
        setRedirects({ main: [] });

        await getDomainRedirectDestination("old.example.com");

        expect(graphQLFetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ filter: { sourceType: { equal: "domain" } } }));
    });
});
