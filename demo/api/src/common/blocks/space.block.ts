import { createSpaceBlock } from "@comet/blocks-api";

/* eslint-disable @typescript-eslint/naming-convention */
export enum Spacing {
    d150 = "d150",
    d200 = "d200",
    d250 = "d250",
    d300 = "d300",
    d350 = "d350",
    d400 = "d400",
    d450 = "d450",
    d500 = "d500",
    d550 = "d550",
    d600 = "d600",
}
/* eslint-enable @typescript-eslint/naming-convention */

export const SpaceBlock = createSpaceBlock({ spacing: Spacing }, "DemoSpace");
