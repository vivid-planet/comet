import { type PropsWithData } from "@comet/site-nextjs";
import { type NewsLinkBlockData } from "@src/blocks.generated";
import { createSitePath } from "@src/util/createSitePath";
import Link from "next/link";
import { type JSX, type PropsWithChildren } from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: PropsWithChildren<Props>): JSX.Element | null {
    if (news === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link
            href={createSitePath({
                scope: news.scope,
                path: `/news/${news.slug}`,
            })}
            title={title}
            className={className}
        >
            {children}
        </Link>
    );
}

export { NewsLinkBlock };
