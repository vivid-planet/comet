import { defaultLanguage, domain } from "@src/config";
import { GQLPage, GQLPagesQuery, GQLPagesQueryVariables, GQLPageTypeQuery, GQLPageTypeQueryVariables } from "@src/graphql.generated";
import NotFound404 from "@src/pages/404";
import PageTypePage, { pageQuery as PageTypePageQuery } from "@src/pageTypes/Page";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetServerSidePropsResult, GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";

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
        query: PageTypePageQuery,
        component: PageTypePage,
    },
};

export const getStaticProps: GetStaticProps<PageUniversalProps> = async ({ params, locale }) => {
    const getUniversalProps = createGetUniversalProps({ language: locale ?? defaultLanguage });
    return await getUniversalProps({ params });
};

interface CreateGetStaticPropsOptions {
    language: string;
    includeInvisibleContent?: boolean;
    previewDamUrls?: boolean;
}

// a function to create a universal function which can be used as getStaticProps or getServerSideProps (preview)
export function createGetUniversalProps({ language, includeInvisibleContent = false, previewDamUrls = false }: CreateGetStaticPropsOptions) {
    return async function getUniversalProps({
        params,
    }: {
        params: ParsedUrlQuery | undefined;
    }): Promise<GetStaticPropsResult<PageUniversalProps> | GetServerSidePropsResult<PageUniversalProps>> {
        const path = params?.path ?? "";
        const contentScope = { domain, language };

        //fetch pageType
        const data = await createGraphQLClient({ includeInvisibleContent, previewDamUrls }).request<GQLPageTypeQuery, GQLPageTypeQueryVariables>(
            pageTypeQuery,
            {
                path: `/${Array.isArray(path) ? path.join("/") : path}`,
                contentScope,
            },
        );
        if (!data.pageTreeNodeByPath?.documentType) {
            // eslint-disable-next-line no-console
            console.log("got no data from api", data, path);
            return { notFound: true };
        }
        const pageId = data.pageTreeNodeByPath.id;

        //pageType dependent query
        const { query: queryForPageType } = pageTypes[data.pageTreeNodeByPath.documentType];
        const pageTypeData = await createGraphQLClient({ includeInvisibleContent, previewDamUrls }).request<GQLPage>(queryForPageType, {
            pageId,
            contentScope,
        });

        return {
            props: {
                ...pageTypeData,
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
