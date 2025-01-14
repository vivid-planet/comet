import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { createSiteUrl } from "@src/util/createSiteUrl";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { news }, children, title, className }: PropsWithChildren<Props>): JSX.Element | null {
    if (news === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link
            href={createSiteUrl({
                baseUrl: "/",
                scope: {
                    language: news.scope.language,
                },
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
