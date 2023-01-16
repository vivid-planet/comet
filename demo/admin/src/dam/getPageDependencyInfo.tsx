import { gql } from "@apollo/client";
import { GetRenderInfo } from "@comet/cms-admin";
import { GQLPageDependencyQuery, GQLPageDependencyQueryVariables } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const damFilePageDependencyQuery = gql`
    query PageDependency($id: ID!) {
        page(id: $id) {
            id
            pageTreeNode {
                id
                name
                path
                category
            }
        }
    }
`;

export const getPageDependencyInfo: GetRenderInfo = async (id: string, { apolloClient, contentScope }) => {
    const { data } = await apolloClient.query<GQLPageDependencyQuery, GQLPageDependencyQueryVariables>({
        query: damFilePageDependencyQuery,
        variables: {
            id,
        },
    });

    if (data.page.pageTreeNode === null) {
        throw new Error(`Could not find a PageTreeNode for Page with id ${id}`);
    }

    const url = `${contentScope.match.url}/pages/pagetree/${categoryToUrlParam(data.page.pageTreeNode.category)}/${data.page.pageTreeNode.id}/edit`;

    return {
        type: <FormattedMessage id="comet.dam.dependencies.Page" defaultMessage="Page" />,
        name: data.page.pageTreeNode.name,
        secondaryInfo: data.page.pageTreeNode.path,
        url: url,
    };
};
