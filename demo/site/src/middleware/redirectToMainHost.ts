import type { PublicSiteConfig } from "@src/site-configs";
import { canonicalizeHost, removeWww } from "@src/util/host";
import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import type { CustomMiddleware } from "./chain";
import { getDomainRedirectDestination } from "./domainRedirects";

type DomainMatcher = {
    siteConfig: PublicSiteConfig;
    hosts: string[];
    pattern?: RegExp;
};

let domainMatchers: DomainMatcher[] | undefined;

/**
 * Site configs don't change at runtime, so canonicalizing their domains and compiling their patterns once
 * keeps the per-request work down to plain string and regex comparisons.
 */
function getDomainMatchers(): DomainMatcher[] {
    domainMatchers ??= getSiteConfigs().map((siteConfig) => ({
        siteConfig,
        hosts: [siteConfig.domains.main, ...(siteConfig.domains.additional ?? [])].map((domain) => removeWww(canonicalizeHost(domain))),
        pattern: siteConfig.domains.pattern ? new RegExp(siteConfig.domains.pattern) : undefined,
    }));

    return domainMatchers;
}

function findSiteConfigForHostToRedirect(canonicalHost: string): PublicSiteConfig | undefined {
    const matchers = getDomainMatchers();
    const hostWithoutWww = removeWww(canonicalHost);

    // Explicitly configured domains take precedence over the more generic pattern.
    return (
        matchers.find((matcher) => matcher.hosts.includes(hostWithoutWww))?.siteConfig ??
        matchers.find((matcher) => matcher.pattern?.test(canonicalHost))?.siteConfig
    );
}

/**
 * Redirecting to the host we are already on would loop forever, so such a destination is skipped in favor
 * of the next option. Targets that aren't absolute URLs can't be redirected to and are skipped as well.
 */
function createCrossHostRedirect(destination: string, canonicalHost: string): NextResponse | undefined {
    let destinationHost: string;
    try {
        destinationHost = canonicalizeHost(new URL(destination).host);
    } catch {
        console.error(`Skipping domain redirect for ${canonicalHost}, its target is not an absolute URL: ${destination}`);
        return undefined;
    }

    if (destinationHost === canonicalHost) {
        console.error(`Skipping domain redirect for ${canonicalHost}, it would redirect to itself: ${destination}`);
        return undefined;
    }

    return NextResponse.redirect(destination, { status: 301 });
}

async function resolveHostWithoutSiteConfig(request: NextRequest, host: string): Promise<NextResponse> {
    const canonicalHost = canonicalizeHost(host);

    const destination = await getDomainRedirectDestination(canonicalHost);
    if (destination) {
        const redirect = createCrossHostRedirect(destination, canonicalHost);
        if (redirect) {
            return redirect;
        }
    }

    const siteConfig = findSiteConfigForHostToRedirect(canonicalHost);
    if (siteConfig) {
        const mainHost = canonicalizeHost(siteConfig.domains.main);
        if (mainHost !== canonicalHost) {
            return NextResponse.redirect(`https://${siteConfig.domains.main}${request.nextUrl.pathname}${request.nextUrl.search}`, {
                status: 301,
            });
        }
        console.error(`Cannot redirect ${canonicalHost} to main host ${mainHost}, they are the same host`);
    }

    return NextResponse.json({ error: `Cannot resolve domain: ${host}` }, { status: 404 });
}

export function withRedirectToMainHostMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const host = getHostByHeaders(request.headers);
        const siteConfig = await getSiteConfigForHost(host);

        if (siteConfig) {
            return middleware(request);
        }

        return resolveHostWithoutSiteConfig(request, host);
    };
}
