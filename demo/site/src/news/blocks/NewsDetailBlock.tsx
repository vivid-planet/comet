"use client";
import { type PropsWithData } from "@comet/site-nextjs";
import { type NewsLinkBlockData } from "@src/blocks.generated";
import { type PropsWithChildren } from "react";

import { type LoadedData } from "./NewsDetailBlock.loader";

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
