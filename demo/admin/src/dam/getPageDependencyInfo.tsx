import { ApolloClient, gql } from "@apollo/client";
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
            }
        }
    }
`;

export const getPageDependencyInfo = async (id: string, apolloClient: ApolloClient<unknown>) => {
    const { data } = await apolloClient.query({
        query: damFilePageDependencyQuery,
        variables: {
            id,
        },
    });

    return {
        type: <FormattedMessage id="comet.dam.dependencies.Page" defaultMessage="Page" />,
        name: data.page.pageTreeNode.name,
        secondaryInfo: data.page.pageTreeNode.path,
    };
};
