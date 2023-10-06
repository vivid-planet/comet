import { defaultLanguage, domain } from "@src/config";
import { GQLPage } from "@src/graphql.generated";
import NotFound404 from "@src/pages/404";
import PageTypePage, { loader as pageTypePageLoader } from "@src/pageTypes/Page";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPaths,
    GetStaticProps,
    GetStaticPropsContext,
    GetStaticPropsResult,
    InferGetStaticPropsType,
} from "next";
import * as React from "react";

import { GQLPagesQuery, GQLPagesQueryVariables, GQLPageTypeQuery, GQLPageTypeQueryVariables } from "./[[...path]].generated";

interface PageProps {
    documentType: string;
    id: string;
}
export type PageUniversalProps = PageProps & GQLPage;

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
    query PageType($path: String!, $contentScope: PageTreeNodeScopeInput!) {
        pageTreeNodeByPath(path: $path, scope: $contentScope) {
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

export const getStaticProps: GetStaticProps<PageUniversalProps> = async (context) => {
    const getUniversalProps = createGetUniversalProps();
    return getUniversalProps(context);
};

interface CreateGetUniversalPropsOptions {
    includeInvisiblePages?: boolean;
    includeInvisibleBlocks?: boolean;
    previewDamUrls?: boolean;
}

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
        const contentScope = { domain, language: locale };

        //fetch pageType
        const data = await client.request<GQLPageTypeQuery, GQLPageTypeQueryVariables>(pageTypeQuery, {
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
        const { loader: loaderForPageType } = pageTypes[data.pageTreeNodeByPath.documentType];
        return {
            props: {
                ...(await loaderForPageType({ client, contentScope, pageId })),
                documentType: data.pageTreeNodeByPath.documentType,
                id: pageId,
            },
        };
    };
}

const pagesQuery = gql`
    query Pages($contentScope: PageTreeNodeScopeInput!) {
        pageTreeNodeList(scope: $contentScope) {
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
            contentScope: { domain, language: locale },
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
