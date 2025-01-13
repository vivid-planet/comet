"use client";
import { resolveUrl } from "@src/util/resolveUrl";
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
                            <sc.StyledLink
                                href={resolveUrl({
                                    path: parentNode.path,
                                    scope: {
                                        language: scope.language,
                                    },
                                })}
                            >
                                {parentNode.name}
                            </sc.StyledLink>

                            <sc.Divider />
                        </Fragment>
                    ))}

                    <sc.StyledLink
                        href={resolveUrl({
                            path: path,
                            scope: {
                                language: scope.language,
                            },
                        })}
                    >
                        {name}
                    </sc.StyledLink>
                </sc.Container>
            )}
        </GridRoot>
    );
};

export default Breadcrumbs;
