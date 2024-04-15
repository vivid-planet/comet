"use client";
import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import * as React from "react";

import { LoadedData } from "./NewsDetailBlock.loader";

function NewsDetailBlock({
    data: { id, loaded },
}: React.PropsWithChildren<PropsWithData<NewsLinkBlockData & { loaded: LoadedData }>>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return (
        <div>
            <h1>News #{id}</h1>
            <p>{loaded.title}</p>
        </div>
    );
}

export { NewsDetailBlock };
