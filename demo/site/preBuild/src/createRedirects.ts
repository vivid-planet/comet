import { gql } from "graphql-request";
import { Redirect } from "next/dist/lib/load-custom-routes";

import { ExternalLinkBlockData, InternalLinkBlockData, NewsLinkBlockData, RedirectsLinkBlockData } from "../../src/blocks.generated";
import { domain } from "../../src/config";
import { GQLRedirectsQuery, GQLRedirectsQueryVariables } from "../../src/graphql.generated";
import createGraphQLClient from "../../src/util/createGraphQLClient";

const createRedirects = async () => {
    return [...(await createApiRedirects()), ...(await createInternalRedirects())];
};

const createInternalRedirects = async (): Promise<Redirect[]> => {
    if (process.env.ADMIN_URL === undefined) {
        console.error(`Cannot create "/admin" redirect: Missing ADMIN_URL environment variable`);
        return [];
    }

    return [
        {
            source: "/admin",
            destination: process.env.ADMIN_URL,
            permanent: false,
        },
    ];
};
const createApiRedirects = async (): Promise<Redirect[]> => {
    const query = gql`
        query Redirects($scope: RedirectScopeInput!) {
            redirects(scope: $scope, active: true) {
                sourceType
                source
                target
            }
        }
    `;
    const apiUrl = process.env.API_URL_INTERNAL;
    if (!apiUrl) {
        console.error("No Environment Variable API_URL_INTERNAL available. Can not perform redirect config");
        return [];
    }

    const response = await createGraphQLClient().request<GQLRedirectsQuery, GQLRedirectsQueryVariables>(query, { scope: { domain } });

    const redirects: Redirect[] = [];

    for (const redirect of response.redirects) {
        let source: string | undefined;
        let destination: string | undefined;

        if (redirect.sourceType === "path") {
            source = redirect.source;
        }

        const target = redirect.target as RedirectsLinkBlockData;

        if (target.block !== undefined) {
            switch (target.block.type) {
                case "internal":
                    destination = (target.block.props as InternalLinkBlockData).targetPage?.path;
                    break;

                case "external":
                    destination = (target.block.props as ExternalLinkBlockData).targetUrl;
                    break;
                case "news":
                    if ((target.block.props as NewsLinkBlockData).id !== undefined) {
                        destination = `/news/${(target.block.props as NewsLinkBlockData).id}`;
                    }

                    break;
            }
        }

        if (source === destination) {
            console.warn(`Skipping redirect loop ${source} -> ${destination}`);
            continue;
        }

        if (source && destination) {
            redirects.push({ source, destination, permanent: true });
        }
    }

    return redirects;
};

export { createRedirects };
