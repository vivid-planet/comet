"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { TeaserBlockData } from "@src/blocks.generated";
import { ColumnsBlock } from "@src/blocks/ColumnsBlock";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { HeadlineBlock } from "@src/blocks/HeadlineBlock";
import { LinkListBlock } from "@src/blocks/LinkListBlock";
import styled from "styled-components";

const TeaserBlock = withPreview(
    ({ data: { headline, image, links, buttons, columns } }: PropsWithData<TeaserBlockData>) => {
        return (
            <Root>
                <HeadlineBlock data={headline} />
                <DamImageBlock data={image} aspectRatio="1x1" />
                <LinkListBlock data={links} />
                <LinkListBlock data={buttons} />
                <ColumnsBlock data={columns} />
            </Root>
        );
    },
    { label: "Teaser" },
);

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

export { TeaserBlock };
