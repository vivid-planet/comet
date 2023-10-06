import { PropsWithData } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import * as React from "react";

function NewsDetailBlock({ data: { id } }: React.PropsWithChildren<PropsWithData<NewsLinkBlockData>>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return (
        <div>
            <h1>News #{id}</h1>
        </div>
    );
}

export { NewsDetailBlock };
