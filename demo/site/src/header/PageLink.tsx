"use client";
import { LinkBlock } from "@src/blocks/LinkBlock";
import { GQLPredefinedPage } from "@src/graphql.generated";
import { predefinedPagePaths } from "@src/predefinedPages/predefinedPagePaths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { GQLPageLinkFragment } from "./PageLink.fragment.generated";

interface Props {
    page: GQLPageLinkFragment;
    children: ((active: boolean) => React.ReactNode) | React.ReactNode;
}

function PageLink({ page, children }: Props): JSX.Element | null {
    const pathname = usePathname();
    const active = pathname === page.path;

    if (page.documentType === "Link") {
        if (page.document === null || page.document.__typename !== "Link") {
            return null;
        }

        return <LinkBlock data={page.document.content}>{typeof children === "function" ? children(active) : children}</LinkBlock>;
    } else if (page.documentType === "Page") {
        return (
            <Link href={page.path} passHref legacyBehavior>
                {typeof children === "function" ? children(active) : children}
            </Link>
        );
    } else if (page.documentType === "PredefinedPage") {
        if (!page.document) {
            return null;
        }

        const type = (page.document as GQLPredefinedPage).type;

        return (
            <Link href={type && predefinedPagePaths[type] ? predefinedPagePaths[type] : ""} passHref legacyBehavior>
                {typeof children === "function" ? children(active) : children}
            </Link>
        );
    } else {
        if (process.env.NODE_ENV === "development") {
            throw new Error(`Unknown documentType "${page.documentType}"`);
        }

        return null;
    }
}

export { PageLink };
