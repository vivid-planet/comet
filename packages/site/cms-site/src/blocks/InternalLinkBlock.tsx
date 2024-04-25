"use client";
import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactNode;
    title?: string;
}

/**
 * @deprecated There should be a copy of this component in the application for flexibility (e.g. multi language support)
 */
export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title }: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return <>{children}</>;
    }

    return (
        <Link
            href={targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path}
            passHref
            title={title}
            legacyBehavior
        >
            {children}
        </Link>
    );
}
