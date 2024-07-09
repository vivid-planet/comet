"use client";
import { BlocksBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
import { ColumnsBlockData, ColumnsContentBlockData } from "@src/blocks.generated";
import * as React from "react";
import styled from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { HeadlineBlock } from "./HeadlineBlock";
import RichTextBlock from "./RichTextBlock";
import SpaceBlock from "./SpaceBlock";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadlineBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
};

const ColumnsContentBlock = withPreview(
    ({ data }: PropsWithData<ColumnsContentBlockData>) => {
        return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Columns content" },
);

const ColumnsBlock = withPreview(
    ({ data: { layout, columns } }: PropsWithData<ColumnsBlockData>) => {
        const Root = layout === "one-column" ? OneColumnRoot : TwoColumnRoot;
        return (
            <Root>
                {columns.map((column) => (
                    <ColumnsContentBlock key={column.key} data={column.props} />
                ))}
            </Root>
        );
    },
    { label: "Columns" },
);

const OneColumnRoot = styled.div`
    padding: 0 40px;
`;

const TwoColumnRoot = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 40px;
`;

export { ColumnsBlock };
