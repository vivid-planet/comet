"use client";
import { PropsWithData } from "@comet/cms-site";
import { InternalLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import * as React from "react";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function InternalLinkBlock({
    data: { targetPage, targetPageAnchor },
    children,
    title,
    className,
}: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return <span className={className}>{children}</span>;
    }

    let href = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;
    if (targetPage.scope) {
        const language = (targetPage.scope as Record<string, string>).language;
        if (language) {
            href = `/${language}${href}`;
        }
    }

    return (
        <Link href={href} title={title} className={className}>
            {children}
        </Link>
    );
}
