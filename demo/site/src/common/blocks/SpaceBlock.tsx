"use client";
<<<<<<< HEAD
import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type SpaceBlockData } from "@src/blocks.generated";
=======
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { SpaceBlockData } from "@src/blocks.generated";
>>>>>>> main
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
