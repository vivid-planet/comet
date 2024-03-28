"use client";
import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
<<<<<<< HEAD
    children: React.ReactNode;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children }: InternalLinkBlockProps) {
=======
    children: React.ReactElement;
    title?: string;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title }: InternalLinkBlockProps): React.ReactElement {
>>>>>>> main
    if (!targetPage) {
        return <>{children}</>;
    }

    return (
<<<<<<< HEAD
        <Link href={targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path} passHref legacyBehavior>
=======
        <Link href={targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path} passHref title={title}>
>>>>>>> main
            {children}
        </Link>
    );
}
