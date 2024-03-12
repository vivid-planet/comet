import { PreviewData } from "@comet/cms-site";
import { defaultLanguage, domain } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import NotFound404 from "@src/pages/404";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";

import { GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables, GQLPagesQuery, GQLPagesQueryVariables } from "./[[...path]].generated";

type PageProps = {
    documentType: string;
    id: string;
} & Record<string, unknown>;

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

const documentTypeQuery = gql`
    query DocumentType($path: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeByPath(path: $path, scope: $scope) {
            id
            documentType
        }
    }
`;

export const getStaticProps: GetStaticProps<PageProps, ParsedUrlQuery, PreviewData> = async ({ params, previewData, locale = defaultLanguage }) => {
    const client = createGraphQLClient(previewData);
    const path = params?.path ?? "";
    const scope = { domain, language: locale };
    //fetch documentType
    const data = await client.request<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
        path: `/${Array.isArray(path) ? path.join("/") : path}`,
        scope,
    });
    if (!data.pageTreeNodeByPath?.documentType) {
        // eslint-disable-next-line no-console
        console.log("got no data from api", data, path);
        return { notFound: true };
    }
    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    //documentType dependent query
    const { loader: loaderForPageType } = documentTypes[data.pageTreeNodeByPath.documentType];
    return {
        props: {
            ...(await loaderForPageType({ client, scope, pageTreeNodeId })),
            documentType: data.pageTreeNodeByPath.documentType,
            id: pageTreeNodeId,
        },
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
