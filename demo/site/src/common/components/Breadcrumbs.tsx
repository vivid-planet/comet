"use client";
import { Fragment } from "react";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import * as sc from "./Breadcrumbs.sc";
import { GridRoot } from "./Breadcrumbs.sc";

const Breadcrumbs = ({ name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <GridRoot>
            {parentNodes.length > 0 && (
                <sc.Container>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <sc.Link href={parentNode.path}> {parentNode.name}</sc.Link>

                            <sc.Divider />
                        </Fragment>
                    ))}

                    <sc.Link href={path}> {name}</sc.Link>
                </sc.Container>
            )}
        </GridRoot>
    );
};

export default Breadcrumbs;
