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
    children: React.ReactNode;
    className?: string;
}

function PageLink({ page, children, className }: Props): JSX.Element | null {
    const pathname = usePathname();
    const active = (pathname.substring(3) || "/") === page.path; // Remove language prefix

    if (page.documentType === "Link") {
        if (page.document === null || page.document.__typename !== "Link") {
            return null;
        }

        // Links to other targets can never be active
        return <LinkBlock data={page.document.content}>{children}</LinkBlock>;
    } else if (page.documentType === "Page") {
        return (
            <Link href={`/${page.scope.language}${page.path}`} className={active ? `active ${className}` : className}>
                {children}
            </Link>
        );
    } else if (page.documentType === "PredefinedPage") {
        if (!page.document) {
            return null;
        }

        const type = (page.document as GQLPredefinedPage).type;

        return (
            <Link
                href={type && predefinedPagePaths[type] ? `/${page.scope.language}${predefinedPagePaths[type]}` : ""}
                className={active ? `active ${className}` : className}
            >
                {children}
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
