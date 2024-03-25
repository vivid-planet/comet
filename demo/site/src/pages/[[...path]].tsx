import { defaultLanguage, domain } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import NotFound404 from "@src/pages/404";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";

import { GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables } from "./[[...path]].generated";
import { PreviewData } from "./api/site-preview";

type PageProps = {
    documentType: string;
    id: string;
} & Record<string, unknown>;

export interface NotFoundProps {
    notFound: true;
}

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    if ("notFound" in props || !documentTypes[props.documentType]) {
        return <NotFound404 />;
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

export const getServerSideProps: GetServerSideProps<PageProps | NotFoundProps, ParsedUrlQuery, PreviewData> = async (context) => {
    const client = createGraphQLClient(context.previewData);
    const locale = context.locale ?? defaultLanguage;
    const scope = { domain, language: locale };
    const path = context.params?.path ?? "";

    //fetch documentType
    const data = await client.request<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
        path: `/${Array.isArray(path) ? path.join("/") : path}`,
        scope,
    });
    if (!data.pageTreeNodeByPath?.documentType) {
        // next 404 page cannot be generated server-side, see: https://nextjs.org/docs/messages/404-get-initial-props
        // (except when using next 13: https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
        // that's why we return a custom props object here for the 404 page which will render the custom 404 page

        context.res.statusCode = 404;
        return {
            props: {
                notFound: true,
            },
        };
    }

    context.res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    //documentType dependent loader
    const { loader: loaderForPageType } = documentTypes[data.pageTreeNodeByPath.documentType];

    return {
        props: {
            ...(await loaderForPageType({ client, scope, pageTreeNodeId })),
            documentType: data.pageTreeNodeByPath.documentType,
            id: pageTreeNodeId,
        },
    };
};
