"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { TextLinkBlockData } from "@src/blocks.generated";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<TextLinkBlockData>) => {
        return <LinkBlock data={link}>{text}</LinkBlock>;
    },
    { label: "Text link" },
);
