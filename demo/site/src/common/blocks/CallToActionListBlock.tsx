"use client";
import { ListBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type CallToActionListBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { CallToActionBlock } from "./CallToActionBlock";

type CallToActionListBlockProps = PropsWithData<CallToActionListBlockData>;

export const CallToActionListBlock = withPreview(
    ({ data }: CallToActionListBlockProps) =>
        data.blocks.length > 0 ? (
            <Root>
                <ListBlock data={data} block={(block) => <CallToActionBlock data={block} />} />
            </Root>
        ) : null,
    { label: "Call To Action List" },
);

const Root = styled.div`
    display: flex;
    flex-flow: row wrap;
    gap: ${({ theme }) => theme.spacing.s300};

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        gap: ${({ theme }) => theme.spacing.s400};
    }
`;
