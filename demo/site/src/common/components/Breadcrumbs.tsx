"use client";
import { Fragment } from "react";

import { GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import * as sc from "./Breadcrumbs.sc";
import { GridRoot } from "./Breadcrumbs.sc";

const Breadcrumbs = ({ name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <GridRoot>
            {parentNodes.length > 0 && (
                <sc.Container>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <sc.StyledLink href={parentNode.path}> {parentNode.name}</sc.StyledLink>

                            <sc.Divider />
                        </Fragment>
                    ))}

                    <sc.StyledLink href={path}> {name}</sc.StyledLink>
                </sc.Container>
            )}
        </GridRoot>
    );
};

export default Breadcrumbs;
