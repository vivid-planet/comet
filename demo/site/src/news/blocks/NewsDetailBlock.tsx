"use client";
<<<<<<< HEAD
import { type PropsWithData } from "@comet/cms-site";
import { type NewsLinkBlockData } from "@src/blocks.generated";
import { type PropsWithChildren } from "react";
=======
import { PropsWithData } from "@comet/site-nextjs";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { PropsWithChildren } from "react";
>>>>>>> main

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
