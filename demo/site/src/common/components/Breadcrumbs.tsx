"use client";
import Link from "next/link";
import { Fragment } from "react";

import { GridRoot } from "../helpers/GridRoot";
import { GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import * as sc from "./Breadcrumbs.sc";

const Breadcrumbs = ({ name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <GridRoot>
            {parentNodes.length > 0 && (
                <sc.Container>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <Link href={parentNode.path} passHref>
                                <sc.Link> {parentNode.name}</sc.Link>
                            </Link>
                            <sc.Divider />
                        </Fragment>
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
