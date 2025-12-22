import { gql } from "@comet/site-nextjs";
import { type RedirectsLinkBlockData } from "@src/blocks.generated";
import type { PublicSiteConfig } from "@src/site-configs";
import { getRedirectTargetUrl } from "@src/util/getRedirectTargetUrl";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import { memoryCache } from "./cache";
import { type CustomMiddleware } from "./chain";

const domainRedirectsQuery = gql`
    query DomainRedirects($scope: RedirectScopeInput!, $offset: Int, $limit: Int) {
        paginatedRedirects(scope: $scope, offset: $offset, limit: $limit) {
            nodes {
                id
                source
                target
                sourceType
            }
            totalCount
        }
    }
`;

async function fetchDomainRedirects(domain: string) {
    const key = `domainRedirects-${domain}`;
    return memoryCache.wrap(key, async () => {
        const graphQLFetch = createGraphQLFetch();
        const limit = 50;
        let totalCount = 0;
        let currentCount = 0;
        let allNodes: { id: string; source: string; target: RedirectsLinkBlockData; sourceType: string }[] = [];

        do {
            const data = await graphQLFetch<
                {
                    paginatedRedirects: {
                        nodes: { id: string; source: string; target: RedirectsLinkBlockData; sourceType: string }[];
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
    });
}

async function getDomainRedirectTarget(domain: string, host: string): Promise<RedirectsLinkBlockData | undefined> {
    const redirects = await fetchDomainRedirects(domain);
    const redirectsArray = Array.isArray(redirects) ? redirects : [redirects];
    const normalizeHost = (value: string) => {
        return value.replace(/^https?:\/\//, "");
    };
    const matching = redirectsArray.find((redirect) => {
        return redirect.sourceType === "domain" && normalizeHost(redirect.source) === normalizeHost(host);
    });
    if (matching) {
        return matching.target;
    }
    return undefined;
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
                    if (typeof domainRedirectTarget === "object" && domainRedirectTarget.block !== undefined) {
                        destination = getRedirectTargetUrl(domainRedirectTarget.block, host);
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
