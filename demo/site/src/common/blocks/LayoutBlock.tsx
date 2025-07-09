"use client";
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { LayoutBlockData } from "@src/blocks.generated";
import styled, { css } from "styled-components";

import { MediaBlock } from "./MediaBlock";
import { RichTextBlock } from "./RichTextBlock";

const layoutOptions: Array<{ name: LayoutBlockData["layout"]; blocks: string[] }> = [
    {
        name: "layout1",
        blocks: ["media1", "text1", "media2"],
    },
    {
        name: "layout2",
        blocks: ["text1", "media2", "text2"],
    },
    {
        name: "layout3",
        blocks: ["media1", "text1", "media2"],
    },
    {
        name: "layout4",
        blocks: ["media1", "text1"],
    },
    {
        name: "layout5",
        blocks: ["text1", "media1"],
    },
    {
        name: "layout6",
        blocks: ["media1", "text1"],
    },
    {
        name: "layout7",
        blocks: ["text1", "media1"],
    },
];

const LayoutBlock = withPreview(
    ({ data: { layout, media1, text1, media2, text2 } }: PropsWithData<LayoutBlockData>) => {
        const layoutVariant = layoutOptions.find((option) => option.name === layout);

        const blockForKey = (key: string) =>
            key === "media1" ? (
                <MediaBlock data={media1} aspectRatio="inherit" />
            ) : key === "text1" ? (
                <RichTextBlock data={text1} />
            ) : key === "media2" ? (
                <MediaBlock data={media2} aspectRatio="inherit" />
            ) : (
                <RichTextBlock data={text2} />
            );

        return (
            <Root>
                {layoutVariant?.blocks.map((key) => (
                    <Box key={key} $layout={layoutVariant.name}>
                        {blockForKey(key)}
                    </Box>
                ))}
            </Root>
        );
    },
    { label: "Columns" },
);

const Root = styled.div`
    display: grid;
    grid-template-columns: repeat(24, 1fr);
`;

const Box = styled.div<{ $layout: string }>`
    grid-column: 1 / -1;
    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        ${({ $layout }) =>
            $layout === "layout1" &&
            css`
                &:nth-child(3n + 1) {
                    grid-column: 1 / 11;
                }
                &:nth-child(3n + 2) {
                    grid-column: 11 / 18;
                }
                &:nth-child(3n + 3) {
                    grid-column: 18 / -1;
                }
            `};
        ${({ $layout }) =>
            $layout === "layout2" &&
            css`
                &:nth-child(3n + 1) {
                    grid-column: 1 / 8;
                }
                &:nth-child(3n + 2) {
                    grid-column: 8 / 18;
                }
                &:nth-child(3n + 3) {
                    grid-column: 18 / -1;
                }
            `};
        ${({ $layout }) =>
            $layout === "layout3" &&
            css`
                &:nth-child(3n + 1) {
                    grid-column: 1 / 7;
                }
                &:nth-child(3n + 2) {
                    grid-column: 7 / 13;
                }
                &:nth-child(3n + 3) {
                    grid-column: 13 / -1;
                }
            `};
        ${({ $layout }) =>
            $layout === "layout4" &&
            css`
                grid-column: 1 / 15;
                &:nth-child(even) {
                    grid-column: 15 / -1;
                }
            `};
        ${({ $layout }) =>
            $layout === "layout5" &&
            css`
                grid-column: 1 / 11;
                &:nth-child(even) {
                    grid-column: 11 / -1;
                }
            `};
        ${({ $layout }) =>
            ($layout === "layout6" || $layout === "layout7") &&
            css`
                grid-column: 1 / 13;
                &:nth-child(even) {
                    grid-column: 13 / -1;
                }
            `};
    }
`;

export { LayoutBlock };
