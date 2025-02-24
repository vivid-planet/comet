"use client";
import { PropsWithData } from "@comet/cms-site";
import { InternalLinkBlockData } from "@src/blocks.generated";
import { createSiteUrl } from "@src/util/createSiteUrl";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface InternalLinkBlockProps extends PropsWithChildren<PropsWithData<InternalLinkBlockData>> {
    title?: string;
    className?: string;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title, className }: InternalLinkBlockProps) {
    if (!targetPage) {
        return <span className={className}>{children}</span>;
    }

    if (targetPage.scope == null) {
        throw new Error("InternalLinkBlock: targetPage.scope is required");
    }

    return (
        <Link
            href={createSiteUrl({
                scope: {
                    language: (targetPage.scope as Record<string, string>).language,
                },
                path: targetPage.path,
                anchor: targetPageAnchor,
            })}
            title={title}
            className={className}
        >
            {children}
        </Link>
    );
}
