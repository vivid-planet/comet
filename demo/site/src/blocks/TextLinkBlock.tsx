import { PropsWithData, withPreview } from "@comet/site-cms";
import { TextLinkBlockData } from "@src/blocks.generated";
import * as React from "react";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<TextLinkBlockData>) => {
        return (
            <LinkBlock data={link}>
                <a>{text}</a>
            </LinkBlock>
        );
    },
    { label: "Link" },
);
