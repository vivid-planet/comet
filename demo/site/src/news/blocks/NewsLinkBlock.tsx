import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import * as React from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: React.PropsWithChildren<Props>): JSX.Element | null {
    if (news === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link href={`/${news.scope.language}/news/${news.slug}`} title={title} className={className}>
            {children}
        </Link>
    );
}

export { NewsLinkBlock };
