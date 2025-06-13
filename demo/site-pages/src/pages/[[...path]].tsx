import { domain as configuredDomain } from "@src/config";
import { inferContentScopeFromContext } from "@src/contentScope/inferContentScopeFromContext";
import { Page as PageTypePage, pageQuery as PageTypePageQuery } from "@src/documents/pages/Page";
import { GQLPageQuery } from "@src/documents/pages/Page.generated";
import NotFound404 from "@src/pages/404";
import { createGraphQLClient } from "@src/util/createGraphQLClient";
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
import { ComponentType } from "react";

import { GQLPagesQuery, GQLPagesQueryVariables, GQLPageTypeQuery, GQLPageTypeQueryVariables } from "./[[...path]].generated";

interface PageProps {
    documentType: string;
    id: string;
}
export type PageUniversalProps = PageProps & GQLPageQuery;

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
    if (!documentTypes[props.documentType]) {
        return (
            <NotFound404>
                <div>
                    unknown documentType: <em>{props.documentType}</em>
                </div>
            </NotFound404>
        );
    }
    const { component: Component } = documentTypes[props.documentType];
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

type DocumentType = {
    component: ComponentType<GQLPageQuery>;
    query: string;
};

const documentTypes: Record<string, DocumentType> = {
    Page: {
        query: PageTypePageQuery,
        component: PageTypePage,
    },
};

export const getStaticProps: GetStaticProps<PageUniversalProps> = async (context) => {
    const getUniversalProps = createGetUniversalProps();
    return getUniversalProps(context);
};

interface CreateGetUniversalPropsOptions {
    includeInvisibleBlocks?: boolean;
    includeInvisiblePages?: boolean;
    previewDamUrls?: boolean;
}

// a function to create a universal function which can be used as getStaticProps or getServerSideProps (preview)
export function createGetUniversalProps({
    includeInvisibleBlocks = false,
    includeInvisiblePages = false,
    previewDamUrls = false,
}: CreateGetUniversalPropsOptions = {}) {
    return async function getUniversalProps<Context extends GetStaticPropsContext | GetServerSidePropsContext>(
        context: Context,
    ): Promise<Context extends GetStaticPropsContext ? GetStaticPropsResult<PageUniversalProps> : GetServerSidePropsResult<PageUniversalProps>> {
        const { params } = context;

        const client = createGraphQLClient({ includeInvisibleBlocks, includeInvisiblePages, previewDamUrls });
        const scope = inferContentScopeFromContext(context);

        const path = params?.path ?? "";

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
        const pageId = data.pageTreeNodeByPath.id;

        //pageType dependent query
        const { query: queryForPageType } = documentTypes[data.pageTreeNodeByPath.documentType];

        const pageTypeData = await client.request(queryForPageType, { pageTreeNodeId: pageId, domain: scope.domain, language: scope.language });

        return {
            props: {
                ...pageTypeData,
                documentType: data.pageTreeNodeByPath.documentType,
                id: pageId,
                scope,
            },
        };
    };
}

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
    if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW !== "true") {
        for (const locale of locales) {
            const data = await createGraphQLClient().request<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
                scope: { domain: configuredDomain, language: locale },
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
    }
    return {
        paths,
        fallback: false,
    };
};
