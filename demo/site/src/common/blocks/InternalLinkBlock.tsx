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

    return (
        <Link
            href={createSiteUrl({
                scope:
                    targetPage.scope != null
                        ? {
                              language: (targetPage.scope as Record<string, string>).language,
                          }
                        : null,
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
