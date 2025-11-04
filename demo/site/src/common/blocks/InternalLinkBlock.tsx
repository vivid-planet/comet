"use client";
import { type PropsWithData } from "@comet/site-nextjs";
import { type InternalLinkBlockData } from "@src/blocks.generated";
import { type GQLPageTreeNodeScope } from "@src/graphql.generated";
import { createSitePath } from "@src/util/createSitePath";
import Link from "next/link";
import { type PropsWithChildren } from "react";

interface InternalLinkBlockProps extends PropsWithChildren<PropsWithData<InternalLinkBlockData>> {
    title?: string;
    className?: string;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title, className }: InternalLinkBlockProps) {
    if (!targetPage) {
        return <span className={className}>{children}</span>;
    }

    const pathWithAnchor = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;

    let href: string;

    if (targetPage.scope) {
        const scope = targetPage.scope as GQLPageTreeNodeScope;
        href = createSitePath({ path: pathWithAnchor, scope });
    } else {
        href = pathWithAnchor;
    }

    return (
        <Link href={href} title={title} className={className}>
            {children}
        </Link>
    );
}
