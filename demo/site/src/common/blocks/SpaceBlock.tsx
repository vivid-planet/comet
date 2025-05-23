"use client";
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { SpaceBlockData } from "@src/blocks.generated";
import styled from "styled-components";

export const SpaceBlock = withPreview(
    ({ data: { spacing } }: PropsWithData<SpaceBlockData>) => {
        return <Root $spacing={spacing} />;
    },
    { label: "Space" },
);

const Root = styled.div<{ $spacing: SpaceBlockData["spacing"] }>`
    height: ${({ theme, $spacing }) => theme.spacing[$spacing]};
`;
