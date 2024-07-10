"use client";
import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

/**
 * @deprecated There should be a copy of this component in the application for flexibility (e.g. multi language support)
 */
export function InternalLinkBlock({
    data: { targetPage, targetPageAnchor },
    children,
    title,
    className,
}: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link href={targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path} title={title} className={className}>
            {children}
        </Link>
    );
}
