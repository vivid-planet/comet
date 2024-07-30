import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import * as React from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string; className?: string };

function NewsLinkBlock({ data: { id }, children, title, className }: React.PropsWithChildren<Props>): JSX.Element | null {
    if (id === undefined) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link href={`/news/${id}`} title={title} className={className}>
            {children}
        </Link>
    );
}

export { NewsLinkBlock };
