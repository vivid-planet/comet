"use client";
import { ListBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { LinkListBlockData } from "@src/blocks.generated";
import * as React from "react";

import { TextLinkBlock } from "./TextLinkBlock";

export const LinkListBlock = withPreview(
    ({ data }: PropsWithData<LinkListBlockData>) => {
        return <ListBlock data={data} block={(props) => <TextLinkBlock data={props} />} />;
    },
    { label: "Link list" },
);
