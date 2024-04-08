import { Link, PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import * as React from "react";

type Props = PropsWithData<NewsLinkBlockData> & { title?: string };

function NewsLinkBlock({ data: { id }, children, title }: React.PropsWithChildren<Props>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return (
        <Link href={{ pathname: "/news/[id]", query: { id } }} title={title}>
            {children}
        </Link>
    );
}

export { NewsLinkBlock };
