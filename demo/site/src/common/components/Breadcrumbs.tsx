"use client";
import { createSiteUrl } from "@src/util/createSiteUrl";
import { Fragment } from "react";

import { GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import * as sc from "./Breadcrumbs.sc";
import { GridRoot } from "./Breadcrumbs.sc";

type BreadcrumbsProps = GQLBreadcrumbsFragment & {
    scope: {
        language: string;
    };
};
const Breadcrumbs = ({ scope, name, path, parentNodes }: BreadcrumbsProps) => {
    return (
        <GridRoot>
            {parentNodes.length > 0 && (
                <sc.Container>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <sc.Link
                                href={createSiteUrl({
                                    baseUrl: "/",
                                    path: parentNode.path,
                                    scope: {
                                        language: scope.language,
                                    },
                                })}
                            >
                                {parentNode.name}
                            </sc.Link>

                            <sc.Divider />
                        </Fragment>
                    ))}

                    <sc.Link
                        href={createSiteUrl({
                            baseUrl: "/",
                            path: path,
                            scope: {
                                language: scope.language,
                            },
                        })}
                    >
                        {name}
                    </sc.Link>
                </sc.Container>
            )}
        </GridRoot>
    );
};

export default Breadcrumbs;
