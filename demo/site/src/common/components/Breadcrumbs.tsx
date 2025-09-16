"use client";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import NextLink from "next/link";
import { Fragment } from "react";
import styled from "styled-components";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";

export const Breadcrumbs = ({ scope, name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <PageLayout grid>
            {parentNodes.length > 0 && (
                <Container>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <Link
                                href={createSitePath({
                                    path: parentNode.path,
                                    scope: scope,
                                })}
                            >
                                {parentNode.name}
                            </Link>

                            <Divider />
                        </Fragment>
                    ))}

                    <Link
                        href={createSitePath({
                            path: path,
                            scope: scope,
                        })}
                    >
                        {name}
                    </Link>
                </Container>
            )}
        </PageLayout>
    );
};

const Container = styled.div`
    padding: 30px 0;
    grid-column: 2 / -2;
`;

const Link = styled(NextLink)`
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;

    font-size: 14px;

    &:last-child {
        font-weight: 700;
        color: ${({ theme }) => theme.palette.text.primary};
    }

    &:hover {
        text-decoration: underline;
    }
`;

const Divider = styled.span`
    display: inline-block;
    width: 15px;
    height: 1px;
    margin: 0 10px 5px 10px;
    background-color: ${({ theme }) => theme.palette.primary.light};
`;
