import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import * as React from "react";

function NewsLinkBlock({ data: { id }, children }: React.PropsWithChildren<PropsWithData<NewsLinkBlockData>>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return <Link href={{ pathname: "/news/[id]", query: { id } }}>{children}</Link>;
}

export { NewsLinkBlock };
