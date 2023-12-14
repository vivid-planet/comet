import { defaultLanguage, domain } from "@src/config";
import { GQLPage } from "@src/graphql.generated";
import NotFound404 from "@src/pages/404";
import PageTypePage, { loader as pageTypePageLoader } from "@src/pageTypes/Page";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";

import { GQLPagesQuery, GQLPagesQueryVariables, GQLPageTypeQuery, GQLPageTypeQueryVariables } from "./[[...path]].generated";
import { PreviewData } from "./api/preview";

type PageProps = GQLPage & {
    documentType: string;
    id: string;
};

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
    if (!pageTypes[props.documentType]) {
        return (
            <NotFound404>
                <div>
                    unknown documentType: <em>{props.documentType}</em>
                </div>
            </NotFound404>
        );
    }
    const { component: Component } = pageTypes[props.documentType];

    return <Component {...props} />;
}

const pageTypeQuery = gql`
    query PageType($path: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeByPath(path: $path, scope: $scope) {
            id
            documentType
        }
    }
`;

const pageTypes = {
    Page: {
        component: PageTypePage,
        loader: pageTypePageLoader,
    },
};

export const getStaticProps: GetStaticProps<PageProps, ParsedUrlQuery, PreviewData> = async ({ params, previewData, locale = defaultLanguage }) => {
    const path = params?.path ?? "";
    const contentScope = { domain, language: locale };
    //fetch pageType
    const data = await createGraphQLClient(previewData).request<GQLPageTypeQuery, GQLPageTypeQueryVariables>(pageTypeQuery, {
        path: `/${Array.isArray(path) ? path.join("/") : path}`,
        contentScope,
    });
    if (!data.pageTreeNodeByPath?.documentType) {
        // eslint-disable-next-line no-console
        console.log("got no data from api", data, path);
        return { notFound: true };
    }
    const pageId = data.pageTreeNodeByPath.id;

    //pageType dependent query
    const { query: queryForPageType } = pageTypes[data.pageTreeNodeByPath.documentType];
    const pageTypeData = await createGraphQLClient(previewData).request<GQLPage>(queryForPageType, {
        pageId,
        domain: contentScope.domain,
        language: contentScope.language,
    });

<<<<<<< HEAD
    return {
        props: {
            ...pageTypeData,
            documentType: data.pageTreeNodeByPath.documentType,
            id: pageId,
        },
=======
// a function to create a universal function which can be used as getStaticProps or getServerSideProps (preview)
export function createGetUniversalProps({
    includeInvisiblePages = false,
    includeInvisibleBlocks = false,
    previewDamUrls = false,
}: CreateGetUniversalPropsOptions = {}) {
    return async function getUniversalProps<Context extends GetStaticPropsContext | GetServerSidePropsContext>({
        params,
        locale = defaultLanguage,
    }: Context): Promise<
        Context extends GetStaticPropsContext ? GetStaticPropsResult<PageUniversalProps> : GetServerSidePropsResult<PageUniversalProps>
    > {
        const client = createGraphQLClient({ includeInvisiblePages, includeInvisibleBlocks, previewDamUrls });
        const path = params?.path ?? "";
        const scope = { domain, language: locale };

        //fetch pageType
        const data = await client.request<GQLPageTypeQuery, GQLPageTypeQueryVariables>(pageTypeQuery, {
            path: `/${Array.isArray(path) ? path.join("/") : path}`,
            scope,
        });
        if (!data.pageTreeNodeByPath?.documentType) {
            // eslint-disable-next-line no-console
            console.log("got no data from api", data, path);
            return { notFound: true };
        }
        const pageTreeNodeId = data.pageTreeNodeByPath.id;

        //pageType dependent query
        const { loader: loaderForPageType } = pageTypes[data.pageTreeNodeByPath.documentType];
        return {
            props: {
                ...(await loaderForPageType({ client, scope, pageTreeNodeId })),
                documentType: data.pageTreeNodeByPath.documentType,
                id: pageTreeNodeId,
            },
        };
>>>>>>> main
    };
};

const pagesQuery = gql`
    query Pages($scope: PageTreeNodeScopeInput!) {
        pageTreeNodeList(scope: $scope) {
            id
            path
            documentType
        }
    }
`;

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
    const paths: Array<{ params: { path: string[] }; locale: string }> = [];

    for (const locale of locales) {
        const data = await createGraphQLClient().request<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
            scope: { domain, language: locale },
        });

        paths.push(
            ...data.pageTreeNodeList
                .filter((page) => page.documentType === "Page")
                .map((page) => {
                    const path = page.path.split("/");
                    path.shift(); // Remove "" caused by leading slash
                    return { params: { path }, locale };
                }),
        );
    }

    return {
        paths,
        fallback: false,
    };
};
