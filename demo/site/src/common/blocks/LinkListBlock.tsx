"use client";
import { ListBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type LinkListBlockData } from "@src/blocks.generated";

import { TextLinkBlock } from "./TextLinkBlock";

export const LinkListBlock = withPreview(
    ({ data }: PropsWithData<LinkListBlockData>) => {
        return <ListBlock data={data} block={(props) => <TextLinkBlock data={props} />} />;
    },
    { label: "Link list" },
);
