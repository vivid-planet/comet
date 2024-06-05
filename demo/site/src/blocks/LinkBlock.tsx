<<<<<<< HEAD
"use client";
import { ExternalLinkBlock, OneOfBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
=======
import {
    DamFileDownloadLinkBlock,
    ExternalLinkBlock,
    InternalLinkBlock,
    OneOfBlock,
    PropsWithData,
    SupportedBlocks,
    withPreview,
} from "@comet/cms-site";
>>>>>>> main
import { LinkBlockData } from "@src/blocks.generated";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import * as React from "react";

import { InternalLinkBlock } from "./InternalLinkBlock";

const supportedBlocks: SupportedBlocks = {
    internal: ({ children, title, ...props }) => (
        <InternalLinkBlock data={props} title={title}>
            {children}
        </InternalLinkBlock>
    ),
    external: ({ children, title, ...props }) => (
        <ExternalLinkBlock data={props} title={title}>
            {children}
        </ExternalLinkBlock>
    ),
    news: ({ children, title, ...props }) => (
        <NewsLinkBlock data={props} title={title}>
            {children}
        </NewsLinkBlock>
    ),
    damFileDownload: ({ children, title, ...props }) => (
        <DamFileDownloadLinkBlock data={props} title={title}>
            {children}
        </DamFileDownloadLinkBlock>
    ),
};

interface LinkBlockProps extends PropsWithData<LinkBlockData> {
    children: React.ReactNode;
}

export const LinkBlock = withPreview(
    ({ data, children }: LinkBlockProps) => {
        return (
            <OneOfBlock data={data} supportedBlocks={supportedBlocks}>
                {children}
            </OneOfBlock>
        );
    },
    { label: "Link" },
);
