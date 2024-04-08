"use client";
import { PropsWithData } from "@comet/cms-site";
import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactNode;
    title?: string;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title }: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return <>{children}</>;
    }

    let href = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;
    if (targetPage.scope) {
        const language = (targetPage.scope as Record<string, string>).language;
        if (language) {
            href = `/${language}${href}`;
        }
    }

    return (
        <Link href={href} passHref title={title} legacyBehavior>
            {children}
        </Link>
    );
}
