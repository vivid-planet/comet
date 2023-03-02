import { PropsWithData, withPreview } from "@comet/cms-site";
import { DemoTextLinkBlockData } from "@src/blocks.generated";
import * as React from "react";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<DemoTextLinkBlockData>) => {
        return (
            <LinkBlock data={link}>
                <a>{text}</a>
            </LinkBlock>
        );
    },
    { label: "Link" },
);
