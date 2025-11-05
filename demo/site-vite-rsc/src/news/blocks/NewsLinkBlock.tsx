import { type PropsWithData } from "@comet/site-react";
import { type NewsLinkBlockData } from "@src/blocks.generated";
import { createSitePath } from "@src/util/createSitePath";
import { type PropsWithChildren } from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: PropsWithChildren<Props>): JSX.Element | null {
    if (news === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <a
            href={createSitePath({
                scope: news.scope,
                path: `/news/${news.slug}`,
            })}
            title={title}
            className={className}
        >
            {children}
        </a>
    );
}

export { NewsLinkBlock };
