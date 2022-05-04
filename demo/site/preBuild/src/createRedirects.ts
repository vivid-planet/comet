import { gql } from "graphql-request";
import { Redirect } from "next/dist/lib/load-custom-routes";

import { GQLRedirectsQuery } from "../../src/graphql.generated";
import createGraphQLClient from "../../src/util/createGraphQLClient";

const createRedirects = async () => {
    return [...(await createApiRedirects()), ...(await createInternalRedirects())];
};

const createInternalRedirects = async (): Promise<Redirect[]> => {
    return [
        {
            source: "/admin",
            destination: process.env.ADMIN_URL!,
            permanent: false,
        },
    ];
};
const createApiRedirects = async (): Promise<Redirect[]> => {
    const query = gql`
        query Redirects {
            redirects(active: true) {
                ...RedirectDetail
            }
        }
        fragment RedirectDetail on Redirect {
            id
            sourceType
            source
            targetType
            targetUrl
            targetPageId
            comment
            targetPage {
                id
                path
            }
        }
    `;
    const apiUrl = process.env.API_URL_INTERNAL;
    if (!apiUrl) {
        console.error("No Environment Variable API_URL_INTERNAL available. Can not perform redirect config");
        return [];
    }

    const response = await createGraphQLClient().request<GQLRedirectsQuery>(query);

    // Map response to nextJs Redirect type
    return response.redirects.reduce((result, redirect) => {
        //Handle Source
        let source: string | undefined;
        let destination: string | undefined;
        if (redirect.sourceType === "path") {
            source = redirect.source;
        }

        if (redirect.targetType === "extern" && redirect.targetUrl) {
            destination = redirect.targetUrl;
        } else if (redirect.targetType === "intern" && redirect.targetPage != null) {
            destination = redirect.targetPage.path;
        }
        if (source && destination) {
            result.push({ source, destination, permanent: true });
        }

        return result;
    }, [] as Redirect[]);
};

export { createRedirects };
