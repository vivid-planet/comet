"use client";
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { TextLinkBlockData } from "@src/blocks.generated";
import { filesize } from "filesize";
import styled from "styled-components";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<TextLinkBlockData>) => {
        if (link.block && link.block.type === "damFileDownload" && "file" in link.block.props && link.block.props.file) {
            return <Link data={link}>{`${text} (${filesize(link.block.props.file.size)})`}</Link>;
        }

        return <Link data={link}>{text}</Link>;
    },
    { label: "Link" },
);

const Link = styled(LinkBlock)`
    color: ${({ theme }) => theme.palette.text.primary};
    &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
    }
`;
