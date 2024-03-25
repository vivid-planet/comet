"use client";
import { ExternalLinkBlock, InternalLinkBlock, OneOfBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
import { LinkBlockData } from "@src/blocks.generated";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import * as React from "react";

const supportedBlocks: SupportedBlocks = {
    internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
    external: ({ children, ...props }) => <ExternalLinkBlock data={props}>{children}</ExternalLinkBlock>,
    news: ({ children, ...props }) => <NewsLinkBlock data={props}>{children}</NewsLinkBlock>,
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
