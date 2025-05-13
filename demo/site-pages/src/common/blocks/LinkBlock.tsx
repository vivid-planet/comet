import {
    DamFileDownloadLinkBlock,
    EmailLinkBlock,
    ExternalLinkBlock,
    OneOfBlock,
    PhoneLinkBlock,
    PropsWithData,
    SupportedBlocks,
    withPreview,
} from "@comet/site-next";
import { LinkBlockData } from "@src/blocks.generated";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import { PropsWithChildren } from "react";

import { InternalLinkBlock } from "./InternalLinkBlock";

const supportedBlocks: SupportedBlocks = {
    internal: ({ children, title, className, ...props }) => (
        <InternalLinkBlock data={props} title={title} className={className}>
            {children}
        </InternalLinkBlock>
    ),
    external: ({ children, title, className, ...props }) => (
        <ExternalLinkBlock data={props} title={title} className={className}>
            {children}
        </ExternalLinkBlock>
    ),
    news: ({ children, title, className, ...props }) => (
        <NewsLinkBlock data={props} title={title} className={className}>
            {children}
        </NewsLinkBlock>
    ),
    damFileDownload: ({ children, title, className, ...props }) => (
        <DamFileDownloadLinkBlock data={props} title={title} className={className}>
            {children}
        </DamFileDownloadLinkBlock>
    ),
    email: ({ children, title, className, ...props }) => (
        <EmailLinkBlock data={props} title={title} className={className}>
            {children}
        </EmailLinkBlock>
    ),
    phone: ({ children, title, className, ...props }) => (
        <PhoneLinkBlock data={props} title={title} className={className}>
            {children}
        </PhoneLinkBlock>
    ),
};

interface LinkBlockProps extends PropsWithChildren<PropsWithData<LinkBlockData>> {
    className?: string;
}

export const LinkBlock = withPreview(
    ({ data, children, className }: LinkBlockProps) => {
        return (
            <OneOfBlock data={data} supportedBlocks={supportedBlocks} className={className}>
                {children}
            </OneOfBlock>
        );
    },
    { label: "Link" },
);
