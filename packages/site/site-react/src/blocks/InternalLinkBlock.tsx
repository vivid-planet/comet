"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithChildren<PropsWithData<InternalLinkBlockData>> {
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

/**
 * @deprecated There should be a copy of this component in the application for flexibility (e.g. multi language support)
 */
export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title, className, legacyBehavior }: InternalLinkBlockProps) {
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
