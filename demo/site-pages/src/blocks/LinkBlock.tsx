import {
    DamFileDownloadLinkBlock,
    ExternalLinkBlock,
    InternalLinkBlock,
    OneOfBlock,
    PropsWithData,
    SupportedBlocks,
    withPreview,
} from "@comet/cms-site";
import { LinkBlockData } from "@src/blocks.generated";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import { PropsWithChildren } from "react";

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

export const LinkBlock = withPreview(
    ({ data, children }: PropsWithChildren<PropsWithData<LinkBlockData>>) => {
        return (
            <OneOfBlock data={data} supportedBlocks={supportedBlocks}>
                {children}
            </OneOfBlock>
        );
    },
    { label: "Link" },
);
