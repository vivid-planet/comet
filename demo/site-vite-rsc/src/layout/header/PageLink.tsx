"use client";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { RouterContext } from "@src/framework/RouterContext";
import { createSitePath } from "@src/util/createSitePath";
import { type PropsWithChildren, use } from "react";

import { type GQLPageLinkFragment } from "./PageLink.fragment.generated";

interface Props extends PropsWithChildren {
    page: GQLPageLinkFragment;
    className?: string;
    activeClassName?: string;
}

function PageLink({ page, children, className: passedClassName, activeClassName }: Props): JSX.Element | null {
    const path = use(RouterContext);
    const active = (path?.path || "/") === page.path;

    let className = passedClassName;

    if (active) {
        className = className ? `${className} ${activeClassName}` : activeClassName;
    }

    if (page.documentType === "Link") {
        if (page.document === null || page.document.__typename !== "Link") {
            return null;
        }

        return (
            <LinkBlock data={page.document.content} className={className}>
                {children}
            </LinkBlock>
        );
    } else if (page.documentType === "Page") {
        return (
            <a
                href={createSitePath({
                    path: page.path,
                    scope: page.scope,
                })}
                className={className}
            >
                {children}
            </a>
        );
    } else if (page.documentType === "PredefinedPage") {
        return (
            <a
                href={createSitePath({
                    path: page.path,
                    scope: page.scope,
                })}
                className={className}
            >
                {children}
            </a>
        );
    } else {
        if (process.env.NODE_ENV === "development") {
            throw new Error(`Unknown documentType "${page.documentType}"`);
        }

        return null;
    }
}

export { PageLink };
