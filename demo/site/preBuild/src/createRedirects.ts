import { gql } from "graphql-request";
import { Redirect } from "next/dist/lib/load-custom-routes";

import { ExternalLinkBlockData, InternalLinkBlockData, NewsLinkBlockData, RedirectsLinkBlockData } from "../../src/blocks.generated";
import { domain, languages } from "../../src/config";
import { GQLLinkRedirectsQuery, GQLLinkRedirectsQueryVariables, GQLRedirectsQuery, GQLRedirectsQueryVariables } from "../../src/graphql.generated";
import createGraphQLClient from "../../src/util/createGraphQLClient";
import { createLinkRedirectDestination } from "./createLinkRedirectDestination";

const graphqQLCLient = createGraphQLClient();

const createRedirects = async () => {
    return [...(await createApiRedirects()), ...(await createInternalRedirects()), ...(await createLinkRedirects())];
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

    const response = await graphqQLCLient.request<GQLRedirectsQuery, GQLRedirectsQueryVariables>(query, { scope: { domain } });

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

const createLinkRedirects = async (): Promise<Redirect[]> => {
    const redirects: Redirect[] = [];

    for (const language of languages) {
        const { pageTreeNodeList } = await graphqQLCLient.request<GQLLinkRedirectsQuery, GQLLinkRedirectsQueryVariables>(
            gql`
                query LinkRedirects($scope: PageTreeNodeScopeInput!) {
                    pageTreeNodeList(scope: $scope) {
                        documentType
                        path
                        document {
                            __typename
                            ... on Link {
                                content
                            }
                        }
                    }
                }
            `,
            {
                scope: { domain, language },
            },
        );

        for (const pageTreeNode of pageTreeNodeList) {
            if (pageTreeNode.document?.__typename === "Link") {
                const destination = createLinkRedirectDestination(pageTreeNode.document.content);

                if (destination) {
                    redirects.push({ source: pageTreeNode.path, destination, permanent: false });
                }
            }
        }
    }

    return redirects;
};

export { createRedirects };
