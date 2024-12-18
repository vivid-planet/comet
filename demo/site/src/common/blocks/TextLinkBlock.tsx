"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { TextLinkBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<TextLinkBlockData>) => {
        if (link.block && link.block.type === "damFileDownload" && "file" in link.block.props && link.block.props.file) {
            return (
                <Link data={link}>
                    <>
                        {text} ({Math.round(link.block.props.file.size / 1024)} KB)
                    </>
                </Link>
            );
        }

        return <Link data={link}>{text}</Link>;
    },
    { label: "Link" },
);

const Link = styled(LinkBlock)`
    color: ${({ theme }) => theme.colors.black};
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
