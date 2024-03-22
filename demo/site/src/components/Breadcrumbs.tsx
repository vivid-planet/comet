"use client";
import { GridRoot } from "@src/components/common/GridRoot";
import Link from "next/link";
import * as React from "react";

import { GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import * as sc from "./Breadcrumbs.sc";

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
