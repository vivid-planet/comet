import Link from "next/link";
import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactElement;
}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children }: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return children;
    }

    return (
        <Link href={targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path} passHref>
            {children}
        </Link>
    );
}
