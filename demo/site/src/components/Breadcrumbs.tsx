import { Link } from "@comet/site-cms";
import { GridRoot } from "@src/components/common/GridRoot";
import { GQLBreadcrumbsFragment } from "@src/graphql.generated";
import { gql } from "graphql-request";
import * as React from "react";

import * as sc from "./Breadcrumbs.sc";

export const breadcrumbsFragment = gql`
    fragment Breadcrumbs on PageTreeNode {
        name
        path
        parentNodes {
            name
            path
        }
    }
`;

const Breadcrumbs: React.FunctionComponent<GQLBreadcrumbsFragment> = ({ name, path, parentNodes }) => {
    return (
        <GridRoot>
            {parentNodes.length > 0 && (
                <sc.Container>
                    {parentNodes.map((parentNode) => (
                        <React.Fragment key={parentNode.path}>
                            <Link href={parentNode.path} passHref>
                                <sc.Link> {parentNode.name}</sc.Link>
                            </Link>
                            <sc.Divider></sc.Divider>
                        </React.Fragment>
                    ))}
                    <Link href={path} passHref>
                        <sc.Link> {name}</sc.Link>
                    </Link>
                </sc.Container>
            )}
        </GridRoot>
    );
};

export default Breadcrumbs;
