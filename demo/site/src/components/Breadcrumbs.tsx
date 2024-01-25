import { Link } from "@comet/cms-site";
import { GridRoot } from "@src/components/common/GridRoot";
import { gql } from "graphql-request";
import * as React from "react";

import { GQLBreadcrumbsFragment } from "./Breadcrumbs.generated";
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
                            <sc.Divider />
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
