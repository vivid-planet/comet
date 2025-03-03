import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { createUrlObjectWithScope } from "@src/util/createUrlObjectWithScope";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: PropsWithChildren<Props>): JSX.Element | null {
    if (news === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link
            href={createUrlObjectWithScope({ path: `/news/${news.slug}`, scope: { language: news.scope.language } })}
            title={title}
            className={className}
        >
            {children}
        </Link>
    );
}

export { NewsLinkBlock };
