import { gql } from "@comet/site-nextjs";
import { type RedirectsLinkBlockData } from "@src/blocks.generated";
import type { PublicSiteConfig } from "@src/site-configs";
import { getRedirectTargetUrl } from "@src/util/getRedirectTargetUrl";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import { memoryCache } from "./cache";
import { type CustomMiddleware } from "./chain";

type Redirect = { source: string; target: RedirectsLinkBlockData; sourceType: string; scope: { domain: string } };

const domainRedirectsQuery = gql`
    query DomainRedirects($scope: RedirectScopeInput!, $offset: Int, $limit: Int) {
        paginatedRedirects(scope: $scope, offset: $offset, limit: $limit) {
            nodes {
                id
                source
                target
                sourceType
                scope {
                    domain
                }
            }
            totalCount
        }
    }
`;

async function fetchPaginatedDomainRedirects(domains: string[]): Promise<Redirect[]> {
    const graphQLFetch = createGraphQLFetch();
    const limit = 50;

    async function fetchForDomain(domain: string): Promise<Redirect[]> {
        let allNodes: Redirect[] = [];
        let totalCount = 0;
        let currentCount = 0;
        do {
            const data = await graphQLFetch<
                {
                    paginatedRedirects: {
                        nodes: Redirect[];
                        totalCount: number;
                    };
                },
                { scope: { domain: string }; offset: number; limit: number }
            >(domainRedirectsQuery, {
                scope: { domain },
                offset: currentCount,
                limit,
            });
            const nodes = data?.paginatedRedirects?.nodes || [];
            totalCount = data?.paginatedRedirects?.totalCount || 0;
            currentCount += nodes.length;
            allNodes = allNodes.concat(nodes);
        } while (currentCount < totalCount);
        return allNodes;
    }

    const results = await Promise.all(domains.map(fetchForDomain));
    return results.flat();
}

async function fetchDomainRedirects(domain: string): Promise<Redirect[]> {
    const key = `domainRedirects-${domain}`;
    return memoryCache.wrap(key, () => fetchPaginatedDomainRedirects([domain]));
}

async function fetchDomainRedirectsForAllScopes(): Promise<Redirect[]> {
    const key = `domainRedirects-all-scopes`;
    const allDomains = getSiteConfigs().map((config) => config.scope.domain);
    return memoryCache.wrap(key, () => fetchPaginatedDomainRedirects(allDomains));
}

function normalizeHost(value: string): string {
    return value.replace(/^https?:\/\//, "");
}

function findDomainRedirect(redirects: Redirect[], host: string): Redirect | undefined {
    return redirects.find((redirect) => redirect.sourceType === "domain" && normalizeHost(redirect.source) === normalizeHost(host));
}

function findDomainRedirectTarget(redirects: Redirect[], host: string): RedirectsLinkBlockData | undefined {
    const matching = findDomainRedirect(redirects, host);
    return matching ? matching.target : undefined;
}

async function getDomainRedirectTarget(domain: string, host: string): Promise<RedirectsLinkBlockData | undefined> {
    const redirects = await fetchDomainRedirects(domain);
    return findDomainRedirectTarget(redirects, host);
}

async function getDomainRedirectTargetForAllScopes(host: string): Promise<{ target: RedirectsLinkBlockData; scopeDomain: string } | undefined> {
    const redirects = await fetchDomainRedirectsForAllScopes();
    const matching = findDomainRedirect(redirects, host);
    return matching ? { target: matching.target, scopeDomain: matching.scope.domain } : undefined;
}

const normalizeDomain = (host: string) => (host.startsWith("www.") ? host.substring(4) : host);

const matchesHostWithAdditionalDomain = (siteConfig: PublicSiteConfig, host: string) => {
    if (normalizeDomain(siteConfig.domains.main) === normalizeDomain(host)) return true; // non-www redirect
    if (siteConfig.domains.additional?.map(normalizeDomain).includes(normalizeDomain(host))) return true;
    return false;
};

const matchesHostWithPattern = (siteConfig: PublicSiteConfig, host: string) => {
    if (!siteConfig.domains.pattern) return false;
    return new RegExp(siteConfig.domains.pattern).test(host);
};

export function withRedirectToMainHostMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        if (!siteConfig) {
            const redirectSiteConfig =
                getSiteConfigs().find((siteConfig) => matchesHostWithAdditionalDomain(siteConfig, host)) ||
                getSiteConfigs().find((siteConfig) => matchesHostWithPattern(siteConfig, host));

            if (redirectSiteConfig) {
                const { scope } = redirectSiteConfig;

                const domainRedirectTarget = await getDomainRedirectTarget(scope.domain, host);

                if (domainRedirectTarget) {
                    let destination: string | undefined;
                    if (domainRedirectTarget.block !== undefined) {
                        destination = getRedirectTargetUrl(domainRedirectTarget.block, redirectSiteConfig.domains.main);
                    }
                    if (destination) {
                        return NextResponse.redirect(destination, { status: 301 });
                    }
                    // Redirect to Main Host
                    return NextResponse.redirect(`https://${redirectSiteConfig.domains.main}${request.nextUrl.pathname}${request.nextUrl.search}`, {
                        status: 301,
                    });
                }
            } else {
                const domainRedirectTarget = await getDomainRedirectTargetForAllScopes(host);

                if (domainRedirectTarget) {
                    const scopedSiteConfig = getSiteConfigs().find((config) => config.scope.domain === domainRedirectTarget.scopeDomain);
                    const redirectHost = scopedSiteConfig?.domains.main ?? host;

                    let destination: string | undefined;
                    if (domainRedirectTarget.target.block !== undefined) {
                        destination = getRedirectTargetUrl(domainRedirectTarget.target.block, redirectHost);
                    }
                    if (destination) {
                        return NextResponse.redirect(destination, { status: 301 });
                    }
                }
            }

            return NextResponse.json({ error: `Cannot resolve domain: ${host}` }, { status: 404 });
        }
        return middleware(request);
    };
}
