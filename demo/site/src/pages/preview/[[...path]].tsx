import { SitePreviewPage } from "@comet/cms-site";
import { defaultLanguage, domain } from "@src/config";
import { GQLPageTypeQuery, GQLPageTypeQueryVariables, GQLPreviewLinkQuery, GQLPreviewLinkQueryVariables } from "@src/graphql.generated";
import Page, { createGetUniversalProps, createPagePath, pageTypeQuery, PageUniversalProps } from "@src/pages/[[...path]]";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";

import { parsePreviewParams } from "../../../../../packages/site/cms-site/src/preview/utils";
import { createLinkRedirectDestination } from "../../../preBuild/src/createLinkRedirectDestination";

const previewLinkQuery = gql`
    query PreviewLink($id: ID!) {
        pageTreeNode(id: $id) {
            document {
                __typename
                ... on Link {
                    content
                }
            }
        }
    }
`;

export default function AuthenticatedPreviewPage(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    return (
        <SitePreviewPage>
            <Page {...props} />
        </SitePreviewPage>
    );
}

export const getServerSideProps: GetServerSideProps<PageUniversalProps> = async (context: GetServerSidePropsContext) => {
    const { includeInvisibleBlocks } = parsePreviewParams(context.query);
    const contentScope = { domain, language: defaultLanguage };
    const path = createPagePath(context.params?.path);
    const clientOptions = {
        includeInvisiblePages: true,
        includeInvisibleBlocks,
        previewDamUrls: true,
    };
    const graphqQLCLient = createGraphQLClient(clientOptions);

    const data = await graphqQLCLient.request<GQLPageTypeQuery, GQLPageTypeQueryVariables>(pageTypeQuery, {
        path,
        contentScope,
    });

    if (data.pageTreeNodeByPath?.documentType === "Link") {
        const { pageTreeNode } = await graphqQLCLient.request<GQLPreviewLinkQuery, GQLPreviewLinkQueryVariables>(previewLinkQuery, {
            id: data.pageTreeNodeByPath.id,
        });

        if (pageTreeNode?.document?.__typename === "Link") {
            const destination = createLinkRedirectDestination(pageTreeNode.document.content);

            if (destination) {
                return {
                    redirect: {
                        destination,
                        permanent: false,
                    },
                };
            }
        }
    }
    const getUniversalProps = createGetUniversalProps(clientOptions);

    return getUniversalProps(context);
};
