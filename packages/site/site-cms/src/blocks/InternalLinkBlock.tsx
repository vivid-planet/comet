import * as React from "react";

import { InternalLinkBlockData } from "../blocks.generated";
import { Link } from "../link/Link";
import { PropsWithData } from "./PropsWithData";

interface InternalLinkBlockProps extends PropsWithData<InternalLinkBlockData> {
    children: React.ReactElement;
}

export function InternalLinkBlock({ data: { targetPage }, children }: InternalLinkBlockProps): React.ReactElement {
    if (!targetPage) {
        return children;
    }

    return (
        <Link href={targetPage.path} passHref>
            {children}
        </Link>
    );
}
