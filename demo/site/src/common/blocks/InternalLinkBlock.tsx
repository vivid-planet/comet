"use client";
import { PropsWithData } from "@comet/cms-site";
import { InternalLinkBlockData } from "@src/blocks.generated";
import { createUrlObjectWithScope } from "@src/util/createUrlObjectWithScope";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface InternalLinkBlockProps extends PropsWithChildren<PropsWithData<InternalLinkBlockData>> {
    title?: string;
    className?: string;
}

interface CreateInternalLinkOptions {
    targetPage: Required<InternalLinkBlockData>["targetPage"];
    targetPageAnchor: InternalLinkBlockProps["data"]["targetPageAnchor"];
}

const createInternalLink = ({ targetPage, targetPageAnchor }: CreateInternalLinkOptions) => {
    const scopedUrlObject = createUrlObjectWithScope({
        path: targetPage.path,
        scope: {
            language: (targetPage.scope as Record<string, string>).language,
        },
    });

    return {
        ...scopedUrlObject,
        hash: targetPageAnchor,
    };
};

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title, className }: InternalLinkBlockProps) {
    if (!targetPage) {
        return <span className={className}>{children}</span>;
    }

    if (targetPage.scope == null) {
        throw new Error("InternalLinkBlock: targetPage.scope is required");
    }

    return (
        <Link href={createInternalLink({ targetPage, targetPageAnchor: targetPageAnchor })} title={title} className={className}>
            {children}
        </Link>
    );
}
