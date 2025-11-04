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

    let href = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;
    if (targetPage.scope) {
        const scope = targetPage.scope as GQLPageTreeNodeScope;
        if (scope.language) {
            href = createSitePath({ path: targetPage.path, scope });
            if (targetPageAnchor !== undefined) {
                href = `${href}#${targetPageAnchor}`;
            }
        }
    }

    return (
        <Link href={href} title={title} className={className}>
            {children}
        </Link>
    );
}
