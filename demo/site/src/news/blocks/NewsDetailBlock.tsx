"use client";
import { PropsWithData } from "@comet/site-nextjs";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { PropsWithChildren } from "react";

import { LoadedData } from "./NewsDetailBlock.loader";

function NewsDetailBlock({ data: { id, loaded } }: PropsWithChildren<PropsWithData<NewsLinkBlockData & { loaded: LoadedData }>>): JSX.Element | null {
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
