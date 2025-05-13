import { PropsWithData } from "@comet/site-next";
import { NewsLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: PropsWithChildren<Props>): JSX.Element | null {
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
