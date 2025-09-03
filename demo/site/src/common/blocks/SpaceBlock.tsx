"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type SpaceBlockData } from "@src/blocks.generated";
import styled from "styled-components";

type SpaceKeys = "D100" | "D200" | "D300" | "D400" | "S100" | "S200" | "S300" | "S400" | "S500" | "S600";

const spacingMap: Record<SpaceBlockData["spacing"], SpaceKeys> = {
    d100: "D100",
    d200: "D200",
    d300: "D300",
    d400: "D400",
    s100: "S100",
    s200: "S200",
    s300: "S300",
    s400: "S400",
    s500: "S500",
    s600: "S600",
};

export const SpaceBlock = withPreview(
    ({ data: { spacing } }: PropsWithData<SpaceBlockData>) => {
        return <Root $spacing={spacingMap[spacing]} />;
    },
    { label: "Space" },
);

const Root = styled.div<{ $spacing: SpaceKeys }>`
    height: ${({ theme, $spacing }) => theme.spacing[$spacing]};
`;
