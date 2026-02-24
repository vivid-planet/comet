"use client";
import {
    DamFileDownloadLinkBlock,
    EmailLinkBlock,
    ExternalLinkBlock,
    OneOfBlock,
    PhoneLinkBlock,
    type PropsWithData,
    type SupportedBlocks,
    withPreview,
} from "@comet/site-nextjs";
import { type LinkBlockData } from "@src/blocks.generated";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import { type AnchorHTMLAttributes, type PropsWithChildren } from "react";

import { InternalLinkBlock } from "./InternalLinkBlock";

interface LinkBlockProps extends PropsWithChildren<PropsWithData<LinkBlockData>>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {}

export const LinkBlock = withPreview(
    ({ data, children, className, ...anchorProps }: LinkBlockProps) => {
        const supportedBlocks: SupportedBlocks = {
            internal: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <InternalLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </InternalLinkBlock>
            ),
            external: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <ExternalLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </ExternalLinkBlock>
            ),
            news: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <NewsLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </NewsLinkBlock>
            ),
            damFileDownload: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <DamFileDownloadLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </DamFileDownloadLinkBlock>
            ),
            email: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <EmailLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </EmailLinkBlock>
            ),
            phone: ({ children: blockChildren, className: blockClassName, ...props }) => (
                <PhoneLinkBlock data={props} className={blockClassName} {...anchorProps}>
                    {blockChildren}
                </PhoneLinkBlock>
            ),
        };

        return (
            <OneOfBlock data={data} supportedBlocks={supportedBlocks} className={className}>
                {children}
            </OneOfBlock>
        );
    },
    { label: "Link" },
);
