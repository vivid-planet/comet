"use client";
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { StandaloneHeadingBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { CSSProperties } from "react";
import styled from "styled-components";

import { HeadingBlock } from "./HeadingBlock";

type StandaloneHeadingBlockProps = PropsWithData<StandaloneHeadingBlockData>;

export const StandaloneHeadingBlock = withPreview(
    ({ data: { heading, textAlignment } }: StandaloneHeadingBlockProps) => {
        return (
            <Root $textAlign={textAlignment}>
                <HeadingBlock data={heading} />
            </Root>
        );
    },
    { label: "Heading" },
);

export const PageContentStandaloneHeadingBlock = (props: StandaloneHeadingBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <StandaloneHeadingBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const Root = styled.div<{ $textAlign: CSSProperties["textAlign"] }>`
    text-align: ${({ $textAlign }) => $textAlign};
`;

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
