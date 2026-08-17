import { gql } from "@dextinity/site-nextjs";
import type { ExternalLinkBlockData, InternalLinkBlockData, NewsLinkBlockData, RedirectsLinkBlockData } from "@src/blocks.generated";
import type { GQLPageTreeNodeScope } from "@src/graphql.generated";
import { createSitePath } from "@src/util/createSitePath";
import { createGraphQLFetchMiddleware } from "@src/util/graphQLClientMiddleware";
import { canonicalizeHost, removeWww } from "@src/util/host";
import { getSiteConfigs } from "@src/util/siteConfig";

import { memoryCache } from "./cache";
import type { GQLDomainRedirectsQuery, GQLDomainRedirectsQueryVariables } from "./domainRedirects.generated";

const domainRedirectsQuery = gql`
    query DomainRedirects($scope: RedirectScopeInput!, $filter: RedirectFilter, $offset: Int, $limit: Int) {
        paginatedRedirects(scope: $scope, filter: $filter, offset: $offset, limit: $limit) {
            nodes {
                source
                target
                active
            }
            totalCount
        }
    }
`;

const graphQLFetch = createGraphQLFetchMiddleware();

/**
 * `paginatedRedirects` resolves the target URL of every redirect in the scope for each page it returns,
 * so a few large pages are considerably cheaper than many small ones. 1000 is the maximum supported limit.
 */
const redirectsPageSize = 1000;

const domainRedirectsCacheKey = "domainRedirectsByHost";

type Redirect = GQLDomainRedirectsQuery["paginatedRedirects"]["nodes"][number];

type DomainRedirect = {
    targetBlock: RedirectsLinkBlockData["block"];
    targetBaseUrl: string;
};

async function fetchDomainRedirects(domain: string): Promise<Redirect[]> {
    const redirects: Redirect[] = [];
    let totalCount = 0;

    do {
        const data = await graphQLFetch<GQLDomainRedirectsQuery, GQLDomainRedirectsQueryVariables>(domainRedirectsQuery, {
            scope: { domain },
            filter: { sourceType: { equal: "domain" } },
            offset: redirects.length,
            limit: redirectsPageSize,
        });

        const nodes = data?.paginatedRedirects?.nodes ?? [];
        if (nodes.length === 0) {
            break; // guards against an endless loop when a page returns fewer nodes than totalCount promises
        }
        redirects.push(...nodes);
        totalCount = data?.paginatedRedirects?.totalCount ?? redirects.length;
    } while (redirects.length < totalCount);

    return redirects;
}

/**
 * Domain redirects change rarely but are looked up on every request to a host that no site config claims,
 * so they are cached as a host-keyed index. A request then costs one lookup instead of a scan over all redirects.
 */
async function getDomainRedirectsByHost(): Promise<Record<string, DomainRedirect>> {
    return memoryCache.wrap(domainRedirectsCacheKey, async () => {
        const redirectsPerSiteConfig = await Promise.all(
            getSiteConfigs().map(async (siteConfig) => ({ siteConfig, redirects: await fetchDomainRedirects(siteConfig.scope.domain) })),
        );

        const redirectsByHost: Record<string, DomainRedirect> = {};

        for (const { siteConfig, redirects } of redirectsPerSiteConfig) {
            for (const redirect of redirects) {
                if (!redirect.active) {
                    continue;
                }
                // The first site config claiming a host wins, matching the order redirects were resolved in before.
                redirectsByHost[canonicalizeHost(redirect.source)] ??= {
                    targetBlock: (redirect.target as RedirectsLinkBlockData).block,
                    targetBaseUrl: `https://${siteConfig.domains.main}`,
                };
            }
        }

        return redirectsByHost;
    });
}

function getRedirectTargetUrl(block: RedirectsLinkBlockData["block"], targetBaseUrl: string): string | undefined {
    if (!block) {
        return undefined;
    }
    switch (block.type) {
        case "internal": {
            const internalLink = block.props as InternalLinkBlockData;
            if (internalLink.targetPage) {
                return `${targetBaseUrl}${createSitePath({
                    path: internalLink.targetPage.path,
                    scope: internalLink.targetPage.scope as GQLPageTreeNodeScope,
                })}`;
            }
            break;
        }
        case "external":
            return (block.props as ExternalLinkBlockData).targetUrl;
        case "news": {
            const newsLink = block.props as NewsLinkBlockData;
            if (newsLink.news) {
                return `${targetBaseUrl}${createSitePath({
                    path: `/news/${newsLink.news.slug}`,
                    scope: newsLink.news.scope,
                })}`;
            }
            break;
        }
    }
    return undefined;
}

/**
 * Resolves the absolute URL that an admin-configured domain redirect for `canonicalHost` points to.
 * Expects a host that was canonicalized with `canonicalizeHost`.
 */
export async function getDomainRedirectDestination(canonicalHost: string): Promise<string | undefined> {
    const redirectsByHost = await getDomainRedirectsByHost();
    const redirect = redirectsByHost[canonicalHost] ?? redirectsByHost[removeWww(canonicalHost)];

    return redirect ? getRedirectTargetUrl(redirect.targetBlock, redirect.targetBaseUrl) : undefined;
}
