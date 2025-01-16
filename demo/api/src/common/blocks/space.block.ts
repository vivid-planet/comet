import { createSpaceBlock } from "@comet/blocks-api";

export enum Spacing {
    D100 = "D100",
    D200 = "D200",
    D300 = "D300",
    D400 = "D400",
    S100 = "S100",
    S200 = "S200",
    S300 = "S300",
    S400 = "S400",
    S500 = "S500",
    S600 = "S600",
}

export const SpaceBlock = createSpaceBlock({ spacing: Spacing });
