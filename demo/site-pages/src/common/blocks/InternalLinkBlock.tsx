import { type PropsWithData } from "@comet/cms-site";
import { type InternalLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import { type PropsWithChildren } from "react";

interface InternalLinkBlockProps extends PropsWithChildren<PropsWithData<InternalLinkBlockData>> {
    title?: string;
    className?: string;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, title, className }: InternalLinkBlockProps) {
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
