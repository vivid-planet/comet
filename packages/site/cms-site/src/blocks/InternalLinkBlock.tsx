"use client";
import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactNode;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

/**
 * @deprecated There should be a copy of this component in the application for flexibility (e.g. multi language support)
 */
export function InternalLinkBlock({
    data: { targetPage, targetPageAnchor },
    children,
    title,
    className,
    legacyBehavior,
}: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        if (legacyBehavior) {
            return <>{children}</>;
        }

        return <span className={className}>{children}</span>;
    }

    const href = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;

    if (legacyBehavior) {
        return (
            <Link href={href} title={title} passHref legacyBehavior>
                {children}
            </Link>
        );
    }

    return (
        <Link href={href} title={title} className={className}>
            {children}
        </Link>
    );
}
